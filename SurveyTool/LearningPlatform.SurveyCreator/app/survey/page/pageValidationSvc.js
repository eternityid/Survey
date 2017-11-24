(function() {
    angular.module('svt').service('pageValidationSvc', pageValidationSvc);
    pageValidationSvc.$inject = [
        'pageSvc', 'surveyEditorValidationSvc', 'constantSvc', 'surveyEditorMessageSvc',
        'arrayUtilSvc', 'stringUtilSvc', 'surveyEditorSvc',
        'surveyEditorPageSvc', 'questionCarryOverSvc'
    ];

    function pageValidationSvc(
        pageSvc, surveyEditorValidationSvc, constantSvc, surveyEditorMessageSvc,
        arrayUtilSvc, stringUtilSvc, surveyEditorSvc,
        surveyEditorPageSvc, questionCarryOverSvc) {
        var service = {
            validateMovingQuestions: validateMovingQuestions,
            validateWhenRemovingQuestion: validateWhenRemovingQuestion,
            getChildQuestionPositionsWhenDeleting: getChildQuestionPositionsWhenDeleting,
            validateWhenRemovingPage: validateWhenRemovingPage
        };
        return service;

        function validateMovingQuestions(event, noneInformationQuestionPositionsInSurvey) {
            var sourcePage = event.source.sortableScope.$parent.pageCtrl.currentPage,
                destPage = event.dest.sortableScope.$parent.pageCtrl.currentPage,
                destinationPageId = destPage.id,
                movingQuestion = event.source.itemScope.question;

            if (surveyEditorPageSvc.isThankYouPage(sourcePage) || surveyEditorPageSvc.isThankYouPage(destPage)) {
                toastr.warning('Cannot move question in thank you page');
                return false;
            }

            return validateMovingQuestionForQuestionMark(event, noneInformationQuestionPositionsInSurvey) &&
                validateMovingQuestionForSkipAction(movingQuestion, destinationPageId);
        }

        function validateMovingQuestionForQuestionMark(movingQuestionEvent, noneInformationQuestionPositionsInSurvey) {
            var movingQuestion = movingQuestionEvent.source.itemScope.question,
                questionPositionsInSurvey = surveyEditorSvc.getAllNoneInformationQuestionPositionsInSurvey(),
                desPageId = movingQuestionEvent.dest.sortableScope.$parent.pageCtrl.currentPage.id;

            return validateItUseQuestionMark() && validateQuestionMarkUseIt();

            function validateItUseQuestionMark() {
                if (!movingQuestion.questionMaskExpression) return true;
                var questionIdsInExpression = getAllQuestionIdsInExpression();
                var questionIndexInExpression = questionIdsInExpression.map(function (value) {
                    return (noneInformationQuestionPositionsInSurvey.indexOf(value) + 1);
                });

                var newPosition = questionPositionsInSurvey.indexOf(movingQuestion.id);
                for (var i = 0; i < questionIdsInExpression.length; i++) {
                    var sourceElementPosition = questionPositionsInSurvey.indexOf(questionIdsInExpression[i]);
                    if (newPosition <= sourceElementPosition) {
                        var errorMessage = 'The display condition of this question used questions (<strong>' +
                            questionIndexInExpression.join(', ') +
                            '</strong>). So you cannot move this question above these questions.';
                        toastr.error(errorMessage);
                        return false;
                    }
                }

                var page = surveyEditorPageSvc.getPageById(desPageId);
                for (var j = 0; j < page.questionDefinitions.length; j++) {
                    if (questionIdsInExpression.indexOf(page.questionDefinitions[j].id) >= 0) {
                        toastr.error('Cannot move this question. The destination page contains questions are used in display condition of the moved question.');
                        return false;
                    }
                }

                return true;
            }

            function getAllQuestionIdsInExpression() {
                var questionIds = [];

                movingQuestion.questionMaskExpression.expressionItems.forEach(function (item) {
                    if (item.questionId && questionIds.indexOf(item.questionId) < 0) questionIds.push(item.questionId);
                });

                return questionIds;
            }

            function validateQuestionMarkUseIt() {
                var questionIdsHasReferencedToMovingQuestion = getQuestionIdsHasReferencedToMovingQuestion();
                if (questionIdsHasReferencedToMovingQuestion.length < 0) return true;
                var questionIndexInExpression = questionIdsHasReferencedToMovingQuestion.map(function (value) {
                    return (noneInformationQuestionPositionsInSurvey.indexOf(value) + 1);
                });

                var newPosition = questionPositionsInSurvey.indexOf(movingQuestion.id);
                for (var i = 0; i < questionIdsHasReferencedToMovingQuestion.length; i++) {
                    var sourceElementPosition = questionPositionsInSurvey.indexOf(questionIdsHasReferencedToMovingQuestion[i]);
                    if (newPosition >= sourceElementPosition) {
                        var errorMessage = 'This question is used in display condition in questions (<strong>' +
                            questionIndexInExpression.join(', ') +
                            '</strong>). So you cannot move this question below these questions.';
                        toastr.error(errorMessage);
                        return false;
                    }
                }

                return true;
            }

            function getQuestionIdsHasReferencedToMovingQuestion() {
                var questionIds = [],
                    currentPages = pageSvc.getCurrentPages();

                for (var pageIndex = 0; pageIndex < currentPages.length; pageIndex++) {
                    var page = currentPages[pageIndex];

                    if (surveyEditorPageSvc.isThankYouPage(page)) continue;
                    for (var questionIndex = 0; questionIndex < page.questionDefinitions.length; questionIndex++) {
                        var question = page.questionDefinitions[questionIndex];

                        if (!question.questionMaskExpression) continue;
                        for (var itemIndex = 0; itemIndex < question.questionMaskExpression.expressionItems.length; itemIndex++) {
                            var expressionItem = question.questionMaskExpression.expressionItems[itemIndex];
                            if (expressionItem.questionId === movingQuestion.id && questionIds.indexOf(expressionItem.questionId) < 0) {
                                questionIds.push(question.id);
                                break;
                            }
                        }
                    }
                }

                return questionIds;
            }
        }

        function validateMovingQuestionForSkipAction(movingQuestion, desPageId) {
            var pagesInSurvey = surveyEditorSvc.getPages();
            var pageIdsInSurvey = getPageIdsInSurvey();
            var relatedPageIds = getRelatedPageIds();

            var unavailableDestinationPageTitles, errorMessage;
            for (var index = 0; index < relatedPageIds.pageIdsHasSkipActionUseMovingQuestionInSkipTo.length; index++) {
                if (pageIdsInSurvey.indexOf(desPageId) <= pageIdsInSurvey.indexOf(relatedPageIds.pageIdsHasSkipActionUseMovingQuestionInSkipTo[index])) {
                    unavailableDestinationPageTitles = getPageTitlesByPageIds(
                        relatedPageIds.pageIdsHasSkipActionUseMovingQuestionInSkipTo);
                    errorMessage = 'This question is used in skip actions of pages (<strong>' +
                            unavailableDestinationPageTitles.join(', ') +
                            '</strong>). So you cannot move this question to/above these pages.';
                    toastr.error(errorMessage);
                    return false;
                }
            }

            if (relatedPageIds.pageIdsHasSkipActionExpressionUseMovingQuestion.length <= 0) return true;
            if (pageIdsInSurvey.indexOf(desPageId) > pageIdsInSurvey.indexOf(relatedPageIds.pageIdsHasSkipActionExpressionUseMovingQuestion[0])) {
                unavailableDestinationPageTitles = getPageTitlesByPageIds(
                    relatedPageIds.pageIdsHasSkipActionExpressionUseMovingQuestion);
                errorMessage = 'This question is used in skip action epxression of pages (<strong>' +
                        unavailableDestinationPageTitles.join(', ') +
                        '</strong>). So you cannot move this question below these pages.';
                toastr.error(errorMessage);
                return false;
            }

            return true;

            function getRelatedPageIds() {
                var pageIdsHasSkipActionExpressionUseMovingQuestion = getPageIdsHasSkipActionExpressionUseMovingQuestion();
                var pageIdsHasSkipActionUseMovingQuestionInSkipTo = getPageIdsHasSkipActionUseMovingQuestionInSkipTo();

                return {
                    pageIdsHasSkipActionExpressionUseMovingQuestion: pageIdsHasSkipActionExpressionUseMovingQuestion,
                    pageIdsHasSkipActionUseMovingQuestionInSkipTo: pageIdsHasSkipActionUseMovingQuestionInSkipTo
                };

                function getPageIdsHasSkipActionExpressionUseMovingQuestion() {
                    var pageIds = [];

                    for (var i = 0; i < pagesInSurvey.length; i++) {
                        var page = pagesInSurvey[i];

                        if (surveyEditorPageSvc.isThankYouPage(page) || !page.skipCommands) continue;

                        var isCompleteScannedPage = false;
                        for (var j = 0; j < page.skipCommands.length && !isCompleteScannedPage; j++) {
                            var skipCommand = page.skipCommands[j];

                            for (var k = 0; k < skipCommand.expression.expressionItems.length; k++) {
                                var expressionItem = skipCommand.expression.expressionItems[k];

                                if (expressionItem.questionId === movingQuestion.id) {
                                    pageIds.push(page.id);
                                    isCompleteScannedPage = true;
                                    break;
                                }
                            }
                        }
                    }

                    return pageIds;
                }

                function getPageIdsHasSkipActionUseMovingQuestionInSkipTo() {
                    var pageIds = [];

                    for (var i = 0; i < pagesInSurvey.length; i++) {
                        var page = pagesInSurvey[i];

                        if (surveyEditorPageSvc.isThankYouPage(page) || page.id === movingQuestion.pageDefinitionId || !page.skipCommands) continue;

                        for (var j = 0; j < page.skipCommands.length; j++) {
                            var skipCommand = page.skipCommands[j];
                            if (skipCommand.skipToQuestionId === movingQuestion.id) {
                                pageIds.push(page.id);
                                break;
                            }
                        }
                    }

                    return pageIds;
                }
            }

            function getPageIdsInSurvey() {
                var pageIds = [];

                for (var i = 0; i < pagesInSurvey.length; i++) {
                    pageIds.push(pagesInSurvey[i].id);
                }

                return pageIds;
            }

            function getPageTitlesByPageIds(pageIds) {
                return pageIds.map(function (pageId) {
                    return stringUtilSvc.getPlainText(pagesInSurvey[pageIdsInSurvey.indexOf(pageId)].title.items[0].text);
                });
            }
        }

        function validateWhenRemovingQuestion(question) {
            var carryOverQuestionPositions = questionCarryOverSvc.getChildQuestionPositions(question.id);
            var questionMarkPositions = surveyEditorValidationSvc.getQuestionPositionsHaveQuestionMarkUseQuestion(question);
            var optionMaskPositions = surveyEditorValidationSvc.getQuestionPositionsHaveOptionMarkUseQuestions([question]);
            var pageTitlesUseSkip = surveyEditorValidationSvc.getPageTitlesHaveSkipCommandUseQuestion(question);
            var deletingQuestionMessage = buildDeletingQuestionPageMessage(
                carryOverQuestionPositions, questionMarkPositions, optionMaskPositions, pageTitlesUseSkip, 'question', question.alias);

            return {
                confirmMessage: deletingQuestionMessage !== '' ? deletingQuestionMessage : constantSvc.messages.deleteQuestion
            };
        }

        function getChildQuestionPositionsWhenDeleting(deletingQuestionCodes) {
            var childQuestionPositions = [];
            var questions = getQuestionsWithOptionForDeleting();

            if (!arrayUtilSvc.isArrayHasElement(questions)) return childQuestionPositions;

            for (var i = 0; i < questions.length; i++) {
                var question = questions[i];
                if (!question || question.options.length <= 0) continue;

                for (var j = 0; j < question.options.length; j++) {
                    var option = question.options[j];
                    var carriedOverQuestionCodes = option.optionsMask.questionId;

                    if (!carriedOverQuestionCodes) continue;
                    if (deletingQuestionCodes.indexOf(carriedOverQuestionCodes) >= 0 &&
                        deletingQuestionCodes.indexOf(question.code) < 0 &&
                        childQuestionPositions.indexOf(question.positionInSurvey) < 0) {
                        childQuestionPositions.push(question.positionInSurvey);
                    }
                }

            }

            return childQuestionPositions;

            function getQuestionsWithOptionForDeleting() {
                var questionsWithOption = surveyEditorSvc.getQuestionsWithOptions(),
                    questionsWithOptionForDeleting = [],
                    appendValue = '...',
                    truncateNumberOfWord = 7;

                if (!arrayUtilSvc.isArrayHasElement(questionsWithOption)) return questionsWithOptionForDeleting;

                for (var m = 0; m < questionsWithOption.length; m++) {

                    var questionWithOption = questionsWithOption[m];
                    var questionTitle = stringUtilSvc.truncateByWordAmount(questionWithOption.title.items[0].text, truncateNumberOfWord, appendValue);

                    questionsWithOptionForDeleting.push({
                        id: questionWithOption.id,
                        title: questionTitle,
                        positionInSurvey: questionWithOption.positionInSurvey,
                        options: questionWithOption.optionList.options
                    });

                    if (questionWithOption.subQuestionDefinition && questionWithOption.subQuestionDefinition.optionList) {
                        questionsWithOptionForDeleting.push({
                            id: questionWithOption.id,
                            title: questionTitle,
                            positionInSurvey: questionWithOption.positionInSurvey,
                            options: questionWithOption.subQuestionDefinition.optionList.options
                        });
                    }
                }
                return questionsWithOptionForDeleting;
            }

        }

        function buildDeletingQuestionPageMessage(carryOverQuestionPositions, questionMarkPositions, optionMaskPositions, skipPageTitles, typeName, displayTitle) {
            if (!arrayUtilSvc.isElementHasSubElement([carryOverQuestionPositions, questionMarkPositions, optionMaskPositions, skipPageTitles])) {
                return '';
            }

            var messageContent = surveyEditorMessageSvc.buildReferenceQuestionPageMessageContent(
                carryOverQuestionPositions, questionMarkPositions, optionMaskPositions, skipPageTitles);
            var messages = [];

            messages.push('<strong>Deleting <i>' + displayTitle + '</i> will affect other questions/pages in survey.</strong>');
            messages.push(messageContent);
            messages.push('Do you want to delete this ' + typeName + '?');

            return messages.join('<br/><br/>');
        }

        function validateWhenRemovingPage(page) {
            var confirmMessage = constantSvc.messages.deletePage;
            var questionCodesInPage = getQuestionCodesInPage();
            var carryOverQuestionPositions = service.getChildQuestionPositionsWhenDeleting(questionCodesInPage);
            var questionMarkPositions = surveyEditorValidationSvc.getQuestionPositionsHaveQuestionMarkUsePage(page);
            var optionMaskPositions = surveyEditorValidationSvc.getQuestionPositionsHaveOptionMarkUseQuestions(page.questionDefinitions);
            var skipPageTitles = surveyEditorValidationSvc.getPageTitlesHaveSkipCommandUsePage(page);
            var typeName = 'page';

            var deletingPageMessage = buildDeletingQuestionPageMessage(
                carryOverQuestionPositions, questionMarkPositions, optionMaskPositions,
                skipPageTitles, typeName, stringUtilSvc.getPlainText(page.title.items[0].text));

            return {
                confirmMessage: deletingPageMessage !== '' ? deletingPageMessage : confirmMessage
            };

            function getQuestionCodesInPage() {
                var questionsInPage = page.questionDefinitions;
                var codes = [];

                questionsInPage.forEach(function (question) {
                    codes.push(question.id);
                });

                return codes;
            }
        }
    }
})();