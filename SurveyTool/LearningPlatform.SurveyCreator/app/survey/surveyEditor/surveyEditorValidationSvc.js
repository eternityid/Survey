(function () {
    angular.module('svt').service('surveyEditorValidationSvc', surveyEditorValidationSvc);
    surveyEditorValidationSvc.$inject = [
        'surveyEditorSvc', 'surveyEditorPageSvc', 'surveyEditorQuestionSvc', 'arrayUtilSvc',
        'scaleQuestionSvc', 'questionConst', 'stringUtilSvc'
    ];

    function surveyEditorValidationSvc(
        surveyEditorSvc, surveyEditorPageSvc, surveyEditorQuestionSvc, arrayUtilSvc,
        scaleQuestionSvc, questionConst, stringUtilSvc) {
        var service = {
            getQuestionPositionsHaveQuestionMarkUseOptions: getQuestionPositionsHaveQuestionMarkUseOptions,
            getPageTitlesHaveSkipCommandUseOptions: getPageTitlesHaveSkipCommandUseOptions,
            getQuestionPositionsHaveQuestionMarkUseQuestion: getQuestionPositionsHaveQuestionMarkUseQuestion,
            getPageTitlesHaveSkipCommandUseQuestion: getPageTitlesHaveSkipCommandUseQuestion,
            getQuestionPositionsHaveQuestionMarkUsePage: getQuestionPositionsHaveQuestionMarkUsePage,
            getPageTitlesHaveSkipCommandUsePage: getPageTitlesHaveSkipCommandUsePage,
            getQuestionPositionsHaveQuestionMarkUseOutOfRange: getQuestionPositionsHaveQuestionMarkUseOutOfRange,
            getPageTitlesHaveSkipCommandUseOutOfRange: getPageTitlesHaveSkipCommandUseOutOfRange,
            validateMovingPage: validateMovingPage,
            getQuestionPositionsHaveOptionMarkUseQuestions: getQuestionPositionsHaveOptionMarkUseQuestions
        };
        return service;

        function getQuestionPositionsHaveQuestionMarkUseOptions(currentQuestion, currentOptions) {
            var questionPositions = [];

            if (!currentQuestion || currentOptions.length < 1) return questionPositions;

            var questionsInSurvey = surveyEditorSvc.getQuestions();
            for (var i = 0; i < questionsInSurvey.length; i++) {
                var question = questionsInSurvey[i];
                if (question.id === currentQuestion.id || !question.questionMaskExpression) continue;
                if (isExpressionUseOptions(question.questionMaskExpression.expressionItems)) {
                    questionPositions.push(question.positionInSurvey);
                }
            }

            return questionPositions;

            function isExpressionUseOptions(expressionItems) {
                return expressionItems.some(function (item) {
                    return currentOptions.map(function (option) {
                        return option.id;
                    }).indexOf(item.optionId) >= 0;
                });
            }
        }

        function getPageTitlesHaveSkipCommandUseOptions(options) {
            var pageTitles = [];

            if (options.length < 1) return pageTitles;

            var pages = surveyEditorSvc.getPages();
            for (var i = 0; i < pages.length; i++) {
                var currentPage = pages[i];
                if (isPageUseOptionInSkip(currentPage)) {
                    pageTitles.push(stringUtilSvc.getPlainText(currentPage.title.items[0].text));
                }
            }

            return pageTitles;

            function isPageUseOptionInSkip(page) {
                for (var j = 0; j < page.skipCommands.length; j++) {
                    if (isSkipCommandUseOption(page.skipCommands[j])) return true;
                }
                return false;
            }

            function isSkipCommandUseOption(skipCommand) {
                var optionIds = options.map(function (option) {
                    return option.id;
                });
                for (var k = 0; k < skipCommand.expression.expressionItems.length; k++) {
                    if (optionIds.indexOf(skipCommand.expression.expressionItems[k].optionId) >= 0) return true;
                }
                return false;
            }
        }

        function getQuestionPositionsHaveQuestionMarkUseQuestion(question) {
            if (!question) return [];
            var positions = [],
                pages = surveyEditorSvc.getPages(),
                optionIds = surveyEditorQuestionSvc.getOptionIdsOfQuestion(question);
            for (var i = 0; i < pages.length; i++) {
                var questionsInPage = pages[i].questionDefinitions;
                for (var j = 0; j < questionsInPage.length; j++) {
                    var goingQuestion = questionsInPage[j];
                    if (!goingQuestion.questionMaskExpression) continue;
                    var useQuestion = isExpressionUseQuestion(goingQuestion.questionMaskExpression.expressionItems),
                        useOptions = isExpressionUseOptions(goingQuestion.questionMaskExpression.expressionItems);
                    if (useQuestion || useOptions) {
                        positions.push(goingQuestion.positionInSurvey);
                    }
                }
            }
            return positions;

            function isExpressionUseQuestion(expressionItems) {
                return expressionItems.some(function (item) {
                    return item.questionId === question.id;
                });
            }

            function isExpressionUseOptions(expressionItems) {
                return expressionItems.some(function (item) {
                    return optionIds.indexOf(item.optionId) >= 0;
                });
            }
        }

        function getQuestionPositionsHaveOptionMarkUseQuestions(questions) {
            if (questions.length === 0) return [];
            var questionIds = questions.map(function (question) {
                return question.id;
            });
            var positions = [],
                pages = surveyEditorSvc.getPages();
            for (var i = 0; i < pages.length; i++) {
                var questionsInPage = pages[i].questionDefinitions;
                for (var j = 0; j < questionsInPage.length; j++) {
                    var goingQuestion = questionsInPage[j];
                    if (goingQuestion.optionsMask !== undefined &&
                        questionIds.indexOf(goingQuestion.optionsMask.questionId) >= 0) {
                        positions.push(goingQuestion.positionInSurvey);
                    }

                }
            }
            return positions;
        }

        function getPageTitlesHaveSkipCommandUseQuestion(question) {
            if (!question) return [];
            var titles = [],
                pages = surveyEditorSvc.getPages();
            for (var i = 0; i < pages.length; i++) {
                if (isPageUseQuestionInSkip(pages[i])) {
                    titles.push(stringUtilSvc.getPlainText(pages[i].title.items[0].text));
                }
            }
            return titles;

            function isPageUseQuestionInSkip(page) {
                for (var j = 0; j < page.skipCommands.length; j++) {
                    if (page.skipCommands[j].skipToQuestionId === question.id) return true;
                    if (isSkipCommandUseQuestion(page.skipCommands[j])) return true;
                }
                return false;
            }

            function isSkipCommandUseQuestion(skipCommand) {
                if (!skipCommand.expression) return false;
                for (var k = 0; k < skipCommand.expression.expressionItems.length; k++) {
                    if (skipCommand.expression.expressionItems[k].questionId === question.id) return true;
                }
                return false;
            }
        }

        function getQuestionPositionsHaveQuestionMarkUsePage(page) {
            if (!page) return [];
            var positions = [],
                pages = surveyEditorSvc.getPages(),
                questionIds = [],
                optionIds = [];
            parseQuestionIdsAndOptionIdsFromPage();

            for (var i = 0; i < pages.length; i++) {
                var questionsInPage = pages[i].questionDefinitions;
                for (var j = 0; j < questionsInPage.length; j++) {
                    var goingQuestion = questionsInPage[j];
                    if (!goingQuestion.questionMaskExpression) continue;
                    var useQuestions = isExpressionUseQuestions(
                        goingQuestion.questionMaskExpression.expressionItems, goingQuestion.pageDefinitionId);
                    var useOptions = isExpressionUseOptions(
                        goingQuestion.questionMaskExpression.expressionItems, goingQuestion.pageDefinitionId);

                    if (useQuestions || useOptions) {
                        positions.push(goingQuestion.positionInSurvey);
                    }
                }
            }
            return positions;

            function parseQuestionIdsAndOptionIdsFromPage() {
                page.questionDefinitions.forEach(function (question) {
                    questionIds.push(question.id);
                    if (question.optionList) {
                        question.optionList.options.forEach(function (option) {
                            optionIds.push(option.id);
                        });
                    }
                });
            }

            function isExpressionUseQuestions(expressionItems, goingPageId) {
                return expressionItems.some(function (item) {
                    return questionIds.indexOf(item.questionId) >= 0 && goingPageId !== page.id;
                });
            }

            function isExpressionUseOptions(expressionItems, goingPageId) {
                return expressionItems.some(function (item) {
                    return optionIds.indexOf(item.optionId) >= 0 && goingPageId !== page.id;
                });
            }
        }

        function getPageTitlesHaveSkipCommandUsePage(page) {
            if (!page) return [];
            var titles = [],
                pages = surveyEditorSvc.getPages();

            var questionIdsInPage = page.questionDefinitions.map(function (question) {
                return question.id;
            });

            for (var i = 0; i < pages.length; i++) {
                if (surveyEditorPageSvc.isThankYouPage(pages[i]) || pages[i].id === page.id) continue;
                if (isPageUsePageInSkip(pages[i])) titles.push(pages[i].name);
            }
            return titles;

            function isPageUsePageInSkip(pageInLoop) {
                for (var j = 0; j < pageInLoop.skipCommands.length; j++) {
                    if (isSkipCommandUsePage(pageInLoop.skipCommands[j])) return true;
                }
                return false;
            }

            function isSkipCommandUsePage(skipCommand) {
                if (questionIdsInPage.indexOf(skipCommand.skipToQuestionId) >= 0) return true;
                for (var k = 0; k < skipCommand.expression.expressionItems.length; k++) {
                    var expressionItem = skipCommand.expression.expressionItems[k];
                    if (questionIdsInPage.indexOf(expressionItem.questionId) >= 0) return true;
                }

                return false;
            }
        }

        function getQuestionPositionsHaveQuestionMarkUseOutOfRange(questionHaveOptionRange) {
            // Note: question types has option range: Scale, Net Promoter Score, Rating
            // Net Promoter Score question cannot change option range
            if (!questionHaveOptionRange) return [];
            var positions = [],
                pages = surveyEditorSvc.getPages();
            var validRange = getValidRangeForLikertRating(questionHaveOptionRange);

            for (var i = 0; i < pages.length; i++) {
                var questionsInPage = pages[i].questionDefinitions;
                for (var j = 0; j < questionsInPage.length; j++) {
                    var goingQuestion = questionsInPage[j];
                    if (!goingQuestion.questionMaskExpression) continue;
                    if (isExpressionUseOutOfRangeOption(goingQuestion.questionMaskExpression.expressionItems)) {
                        positions.push(goingQuestion.positionInSurvey);
                    }
                }
            }
            return positions;

            function isExpressionUseOutOfRangeOption(expressionItems) {
                return expressionItems.some(function (item) {
                    if (item.questionId !== questionHaveOptionRange.id) return false;
                    return item.value < validRange.min || item.value > validRange.max;
                });
            }
        }

        function getValidRangeForLikertRating(likertRatingQuestion) {
            var validRange = { min: 0, max: 0 };
            if (likertRatingQuestion.$type === questionConst.questionTypes.rating) {
                validRange.max = likertRatingQuestion.optionList.options.length;
            } else if (likertRatingQuestion.$type === questionConst.questionTypes.scale) {
                var likertRange = scaleQuestionSvc.getScoreByOptionList(likertRatingQuestion.optionList);
                validRange.min = likertRange.min;
                validRange.max = likertRange.max;
            }
            return validRange;
        }

        function getPageTitlesHaveSkipCommandUseOutOfRange(questionHaveOptionRange) {
            if (!questionHaveOptionRange) return [];
            var titles = [],
                pages = surveyEditorSvc.getPages();
            var validRange = getValidRangeForLikertRating(questionHaveOptionRange);
            for (var i = 0; i < pages.length; i++) {
                if (isPageUseOutOfRangeOptionInSkip(pages[i])) {
                    titles.push(stringUtilSvc.getPlainText(pages[i].title.items[0].text));
                }
            }
            return titles;

            function isPageUseOutOfRangeOptionInSkip(page) {
                for (var j = 0; j < page.skipCommands.length; j++) {
                    var skipCommand = page.skipCommands[j];
                    if (!skipCommand.expression) continue;
                    for (var k = 0; k < skipCommand.expression.expressionItems.length; k++) {
                        var expressionItem = skipCommand.expression.expressionItems[k];
                        if (expressionItem.questionId === questionHaveOptionRange.id) {
                            if (expressionItem.value < validRange.min || expressionItem.value > validRange.max) return true;
                        }
                    }
                }
                return false;
            }
        }

        function validateMovingPage(pages, movingPageEvent, positions) {
            if (!surveyEditorPageSvc.isThankYouPage(pages[pages.length - 1])) {
                toastr.warning('Cannot move thank you page.');
                return false;
            }

            var movingPage = movingPageEvent.source.itemScope.page,
                pagePositions = positions ? positions : surveyEditorSvc.getOrderPageIdsInSurvey();

            return validateMovingPageForExpressionBuilder() && validateMovingPageForSkipAction();

            function validateMovingPageForExpressionBuilder() {
                var relatedPageIds = getRelatedPageIds();

                var pageId, errorMessage, relatedPageTitlesForErrorMessage;

                for (var i = 0; i < relatedPageIds.pageIdsHasQuestionMaskUsingQuestionInMovingPage.length; i++) {
                    pageId = relatedPageIds.pageIdsHasQuestionMaskUsingQuestionInMovingPage[i];

                    if (pagePositions.indexOf(movingPage.id) > pagePositions.indexOf(pageId)) {
                        relatedPageTitlesForErrorMessage = getPageTitlesByPageIds(
                            relatedPageIds.pageIdsHasQuestionMaskUsingQuestionInMovingPage);
                        errorMessage = 'This page has questions that were used in question mask of pages (<strong>' +
                            relatedPageTitlesForErrorMessage.join(', ') +
                            '</strong>). So you cannot move this page below these pages.';
                        toastr.error(errorMessage);
                        return false;
                    }
                }
                for (var j = 0; j < relatedPageIds.pageIdsHasQuestionIsUsedInQuestionMaskOfMovingPage.length; j++) {
                    pageId = relatedPageIds.pageIdsHasQuestionIsUsedInQuestionMaskOfMovingPage[j];

                    if (pagePositions.indexOf(movingPage.id) < pagePositions.indexOf(pageId)) {
                        relatedPageTitlesForErrorMessage = getPageTitlesByPageIds(
                            relatedPageIds.pageIdsHasQuestionIsUsedInQuestionMaskOfMovingPage);
                        errorMessage = 'This page has question mask that are using questions in pages (<strong>' +
                            relatedPageTitlesForErrorMessage.join(', ') +
                            '</strong>). So you cannot move this page above these pages.';
                        toastr.error(errorMessage);
                        return false;
                    }
                }

                return true;

                function getRelatedPageIds() {
                    var pagesInSurvey = surveyEditorSvc.getPages(),
                        questionIdsInMovingPage = getAllQuestionIdsInMovingPage();

                    return {
                        pageIdsHasQuestionIsUsedInQuestionMaskOfMovingPage: getPageIdsHasQuestionIsUsedInQuestionMaskOfMovingPage(),
                        pageIdsHasQuestionMaskUsingQuestionInMovingPage: getPageIdsHasQuestionMaskUsingQuestionInMovingPage()
                    };

                    function getPageIdsHasQuestionIsUsedInQuestionMaskOfMovingPage() {
                        var pageIds = [];

                        for (var m = 0; m < pagesInSurvey.length; m++) {
                            var page = pagesInSurvey[m];
                            if (surveyEditorPageSvc.isThankYouPage(page) || page.id === movingPage.id) continue;

                            for (var n = 0; n < page.questionDefinitions.length; n++) {
                                var question = page.questionDefinitions[n];

                                if (questionIdsInMovingPage.questionIdsUsedInQuestionMask.indexOf(question.id) >= 0) {
                                    pageIds.push(page.id);
                                    break;
                                }
                            }
                        }

                        return pageIds;
                    }

                    function getPageIdsHasQuestionMaskUsingQuestionInMovingPage() {
                        var pageIds = [];

                        for (var p = 0; p < pagesInSurvey.length; p++) {
                            var page = pagesInSurvey[p];
                            if (surveyEditorPageSvc.isThankYouPage(page) || page.id === movingPage.id) continue;

                            var isCompleteScannedPage = false;
                            for (var q = 0; q < page.questionDefinitions.length && !isCompleteScannedPage; q++) {
                                var question = page.questionDefinitions[q];
                                if (!question.questionMaskExpression) continue;

                                for (var k = 0; k < question.questionMaskExpression.expressionItems.length; k++) {
                                    var expressionItem = question.questionMaskExpression.expressionItems[k];
                                    if (questionIdsInMovingPage.childQuestionIds.indexOf(expressionItem.questionId) >= 0) {
                                        pageIds.push(page.id);
                                        isCompleteScannedPage = true;
                                        break;
                                    }
                                }
                            }
                        }

                        return pageIds;
                    }
                }

                function getAllQuestionIdsInMovingPage() {
                    var questionIdsInMovingPage = {
                        childQuestionIds: [],
                        questionIdsUsedInQuestionMask: []
                    };

                    for (var questionIndex = 0; questionIndex < movingPage.questionDefinitions.length; questionIndex++) {
                        var question = movingPage.questionDefinitions[questionIndex];

                        questionIdsInMovingPage.childQuestionIds.push(question.id);
                        if (!question.questionMaskExpression) continue;

                        for (var itemIndex = 0; itemIndex < question.questionMaskExpression.expressionItems.length; itemIndex++) {
                            var expressionItem = question.questionMaskExpression.expressionItems[itemIndex];

                            if (expressionItem.questionId && questionIdsInMovingPage.questionIdsUsedInQuestionMask.indexOf(expressionItem.questionId) < 0) {
                                questionIdsInMovingPage.questionIdsUsedInQuestionMask.push(expressionItem.questionId);
                            }
                        }
                    }

                    return questionIdsInMovingPage;
                }
            }

            function getPageTitlesByPageIds(pageIds) {
                return pageIds.map(function (pageId) {
                    var page = surveyEditorPageSvc.getPageById(pageId);
                    return page ? stringUtilSvc.getPlainText(page.title.items[0].text) : '';
                });
            }

            function validateMovingPageForSkipAction() {
                var questionIdsInPage = surveyEditorPageSvc.getQuestionIdsInPage(movingPage.id);
                var pagesInSurvey = surveyEditorSvc.getPages();

                return validatePageHasSkipActionJumpToMovingPage() &&
                    validatePageHasSkipActionExpressionUseQuestionInMovingPage() &&
                    validatePageHasQuestionsUsedInSkipActionToOfMovingPage() &&
                    validatePagHasQuestionsUsedInSkipActionExpressionOfMovingPage();

                function validatePageHasSkipActionJumpToMovingPage() {
                    var pageIdsHasSkipActionJumpToMovingPage = getPageIdsHasSkipActionJumpToMovingPage();

                    for (var i = 0; i < pageIdsHasSkipActionJumpToMovingPage.length; i++) {
                        if (pagePositions.indexOf(movingPage.id) < pagePositions.indexOf(pageIdsHasSkipActionJumpToMovingPage[i])) {
                            var unvailableDestinationPageTitles = getPageTitlesByPageIds(pageIdsHasSkipActionJumpToMovingPage);
                            var errorMessage = 'This page was referenced in skip actions of pages (<strong>' +
                                unvailableDestinationPageTitles.join(', ') +
                                '</strong>). So you cannot move this page above these pages.';
                            toastr.error(errorMessage);
                            return false;
                        }
                    }

                    return true;

                    function getPageIdsHasSkipActionJumpToMovingPage() {
                        var pageIds = [];

                        for (var m = 0; m < pagesInSurvey.length; m++) {
                            var page = pagesInSurvey[m];
                            if (surveyEditorPageSvc.isThankYouPage(page) || page.id === movingPage.id || !page.skipCommands) continue;

                            for (var n = 0; n < page.skipCommands.length; n++) {
                                var skipCommand = page.skipCommands[n];
                                if (questionIdsInPage.indexOf(skipCommand.skipToQuestionId) >= 0) {
                                    pageIds.push(page.id);
                                    break;
                                }
                            }
                        }

                        return pageIds;
                    }
                }

                function validatePageHasSkipActionExpressionUseQuestionInMovingPage() {
                    var pageIdsHasSkipActionExpressionUseQuestionInMovingPage = getPageIdsHasSkipActionExpressionUseQuestionInMovingPage();

                    for (var i = 0; i < pageIdsHasSkipActionExpressionUseQuestionInMovingPage.length; i++) {
                        if (pagePositions.indexOf(movingPage.id) > pagePositions.indexOf(pageIdsHasSkipActionExpressionUseQuestionInMovingPage[i])) {
                            var unvailableDestinationPageTitles = getPageTitlesByPageIds(
                                pageIdsHasSkipActionExpressionUseQuestionInMovingPage);
                            var errorMessage = 'This page was referenced in skip action epxression of pages (<strong>' +
                                unvailableDestinationPageTitles.join(', ') +
                                '</strong>). So you cannot move this page below these pages.';
                            toastr.error(errorMessage);
                            return false;
                        }
                    }

                    return true;

                    function getPageIdsHasSkipActionExpressionUseQuestionInMovingPage() {
                        var pageIds = [];

                        for (var m = 0; m < pagesInSurvey.length; m++) {
                            var page = pagesInSurvey[m];
                            if (surveyEditorPageSvc.isThankYouPage(page) || page.id === movingPage.id || !page.skipCommands) continue;

                            var isCompleteScannedPage = false;
                            for (var n = 0; n < page.skipCommands.length && !isCompleteScannedPage; n++) {
                                var skipCommand = page.skipCommands[n];

                                for (var k = 0; k < skipCommand.expression.expressionItems.length; k++) {
                                    var expressionItem = skipCommand.expression.expressionItems[k];

                                    if (!expressionItem.questionId) continue;
                                    if (questionIdsInPage.indexOf(expressionItem.questionId) >= 0) {
                                        pageIds.push(page.id);
                                        isCompleteScannedPage = true;
                                        break;
                                    }
                                }
                            }
                        }

                        return pageIds;
                    }
                }

                function validatePageHasQuestionsUsedInSkipActionToOfMovingPage() {
                    if (!movingPage.skipCommands || movingPage.skipCommands.length <= 0) return true;

                    var questionIdsUsedInSkipActionToOfMovingPage = getQuestionIdsUsedInSkipActionToOfMovingPage();
                    var pageIdsHasQuestionsUsedInSkipActionToOfMovingPage = getPageIdsHasQuestionsUsedInSkipActionToOfMovingPage();

                    for (var i = 0; i < pageIdsHasQuestionsUsedInSkipActionToOfMovingPage.length; i++) {
                        if (pagePositions.indexOf(movingPage.id) > pagePositions.indexOf(pageIdsHasQuestionsUsedInSkipActionToOfMovingPage[i])) {
                            var unvailableDestinationPageTitles = getPageTitlesByPageIds(
                                pageIdsHasQuestionsUsedInSkipActionToOfMovingPage);
                            var errorMessage = 'This page has skip action jump to pages (<strong>' +
                                unvailableDestinationPageTitles.join(', ') +
                                '</strong>). So you cannot move this page below these pages.';
                            toastr.error(errorMessage);
                            return false;
                        }
                    }

                    return true;

                    function getPageIdsHasQuestionsUsedInSkipActionToOfMovingPage() {
                        var pageIds = [];

                        for (var m = 0; m < pagesInSurvey.length; m++) {
                            var page = pagesInSurvey[m];
                            if (surveyEditorPageSvc.isThankYouPage(page) || page.id === movingPage.id || !page.skipCommands) continue;

                            for (var n = 0; n < page.questionDefinitions.length; n++) {
                                var question = page.questionDefinitions[n];
                                if (questionIdsUsedInSkipActionToOfMovingPage.indexOf(question.id) >= 0) {
                                    pageIds.push(page.id);
                                    break;
                                }
                            }
                        }

                        return pageIds;
                    }

                    function getQuestionIdsUsedInSkipActionToOfMovingPage() {
                        var questionIds = [];

                        for (var p = 0; p < movingPage.skipCommands.length; p++) {
                            var skipCommand = movingPage.skipCommands[p];
                            if (questionIds.indexOf(skipCommand.skipToQuestionId) < 0) questionIds.push(skipCommand.skipToQuestionId);
                        }

                        return questionIds;
                    }
                }

                function validatePagHasQuestionsUsedInSkipActionExpressionOfMovingPage() {
                    if (!arrayUtilSvc.isArrayHasElement(movingPage.skipCommands)) return true;

                    var questionIdsUsedInSkipActionExpressionOfMovingPage = getQuestionIdsUsedInSkipActionExpressionOfMovingPage();
                    var pageIdsHasQuestionsUsedInSkipActionExpressionOfMovingPage = getPageIdsHasQuestionsUsedInSkipActionExpressionOfMovingPage();

                    for (var i = 0; i < pageIdsHasQuestionsUsedInSkipActionExpressionOfMovingPage.length; i++) {
                        if (pagePositions.indexOf(movingPage.id) < pagePositions.indexOf(pageIdsHasQuestionsUsedInSkipActionExpressionOfMovingPage[i])) {
                            var unvailableDestinationPageTitles = getPageTitlesByPageIds(
                                pageIdsHasQuestionsUsedInSkipActionExpressionOfMovingPage);
                            var errorMessage = 'This page has skip action expression use questions in pages (<strong>' +
                                unvailableDestinationPageTitles.join(', ') +
                                '</strong>). So you cannot move this page above these pages.';
                            toastr.error(errorMessage);
                            return false;
                        }
                    }

                    return true;

                    function getPageIdsHasQuestionsUsedInSkipActionExpressionOfMovingPage() {
                        var pageIds = [];

                        for (var m = 0; m < pagesInSurvey.length; m++) {
                            var page = pagesInSurvey[m];
                            if (surveyEditorPageSvc.isThankYouPage(page) || page.id === movingPage.id || !page.skipCommands) continue;

                            for (var n = 0; n < page.questionDefinitions.length; n++) {
                                var question = page.questionDefinitions[n];
                                if (questionIdsUsedInSkipActionExpressionOfMovingPage.indexOf(question.id) >= 0) {
                                    pageIds.push(page.id);
                                    break;
                                }
                            }
                        }

                        return pageIds;
                    }

                    function getQuestionIdsUsedInSkipActionExpressionOfMovingPage() {
                        var questionIds = [];

                        for (var p = 0; p < movingPage.skipCommands.length; p++) {
                            var skipCommand = movingPage.skipCommands[p];
                            for (var q = 0; q < skipCommand.expression.expressionItems.length; q++) {
                                var expressionItem = skipCommand.expression.expressionItems[q];
                                if (expressionItem.questionId && questionIds.indexOf(expressionItem.questionId) < 0) {
                                    questionIds.push(expressionItem.questionId);
                                }
                            }
                        }

                        return questionIds;
                    }
                }
            }
        }
    }
})();