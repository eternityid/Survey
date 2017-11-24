(function () {
    angular.module('svt').service('surveyEditorPageSvc', surveyEditorPageSvc);
    surveyEditorPageSvc.$inject = ['surveyEditorSvc', 'arrayUtilSvc'];

    function surveyEditorPageSvc(surveyEditorSvc, arrayUtilSvc) {
        var service = {
            getPageById: getPageById,
            handleDeletePage: handleDeletePage,
            getQuestionsByPageId: getQuestionsByPageId,
            getQuestionsBeforePageId: getQuestionsBeforePageId,
            appendQuestionIntoPage: appendQuestionIntoPage,
            isThankYouPage: isThankYouPage,
            isThankYouPageById: isThankYouPageById,
            handleRemoveSkipCommandInPage: handleRemoveSkipCommandInPage,
            getQuestionIdsInPage: getQuestionIdsInPage,
            updatePageSettings: updatePageSettings
        };
        return service;

        function getPageById(pageId) {
            var pages = surveyEditorSvc.getPages();
            for (var i = 0; i < pages.length; i++) {
                if (pages[i].id === pageId) return pages[i];
            }
            return null;
        }

        function handleDeletePage(removedPageId) {
            var removeQuestionIds = getQuestionsByPageId(removedPageId).map(function (question) {
                return question.id;
            });

            removePage();
            removeReferencedDataToPage();
            surveyEditorSvc.refreshSummaryDataForSurvey();
            surveyEditorSvc.setupQuestionPositionInSurvey();
            return;

            function removePage() {
                var childNodes = surveyEditorSvc.getData().survey.topFolder.childNodes,
                    pageIndex = childNodes.map(function (page) {
                        return page.id;
                    }).indexOf(removedPageId);
                if (pageIndex >= 0) {
                    childNodes.splice(pageIndex, 1);
                }
            }

            function removeReferencedDataToPage() {
                var pages = surveyEditorSvc.getPages();
                pages.forEach(function (page) {
                    cleanSkipCommandForPage(page, removeQuestionIds);
                    var questions = getQuestionsByPageId(page.id);
                    questions.forEach(function (question) {
                        cleanCarryOverForQuestion(question, removeQuestionIds);
                        cleanQuestionMarkForQuestion(question, removeQuestionIds);
                    });
                });
                return;
            }
        }

        function cleanSkipCommandForPage(dirtyPage, invaliQuestionIds) {
            var skipCommandCount = dirtyPage.skipCommands.length;
            for (var i = skipCommandCount - 1; i >= 0; i--) {
                var skipCommand = dirtyPage.skipCommands[i];
                if (invaliQuestionIds.indexOf(skipCommand.skipToQuestionId) >= 0 || isSkipCommandUseInvalidQuestion(skipCommand)) {
                    dirtyPage.skipCommands.splice(i, 1);
                }
            }
            return;

            function isSkipCommandUseInvalidQuestion(skipCommandItem) {
                if (!skipCommandItem.expression || !arrayUtilSvc.isArrayHasElement(skipCommandItem.expression.expressionItems)) return false;
                for (var j = 0; j < skipCommandItem.expression.expressionItems.length; j++) {
                    if (invaliQuestionIds.indexOf(skipCommandItem.expression.expressionItems[j].questionId) >= 0) return true;
                }
                return false;
            }
        }

        function getQuestionsByPageId(pageId) {
            var pages = surveyEditorSvc.getPages();
            for (var i = 0; i < pages.length; i++) {
                if (pages[i].id === pageId) {
                    return pages[i].questionDefinitions;
                }
            }
            return [];
        }

        function cleanCarryOverForQuestion(dirtyQuestion, invaliQuestionIds) {
            if (!dirtyQuestion.optionList || !arrayUtilSvc.isArrayHasElement(dirtyQuestion.optionList.options)) return;
            var optionsCount = dirtyQuestion.optionList.options.length;
            for (var i = optionsCount - 1; i >= 0; i--) {
                var option = dirtyQuestion.optionList.options[i];
                if (option.optionsMask && invaliQuestionIds.indexOf(option.optionsMask.questionId) >= 0) {
                    removeAnswerByOptionId(option.id);
                    dirtyQuestion.optionList.options.splice(i, 1);
                }
            }

            function removeAnswerByOptionId(optionId) {
                if (!dirtyQuestion.answers) return;
                var indexToRemove = dirtyQuestion.answers.map(function (answer) {
                    return answer.optionId;
                }).indexOf(optionId);

                if (indexToRemove >= 0) {
                    dirtyQuestion.answers.splice(indexToRemove, 1);
                }
            }
        }

        function cleanQuestionMarkForQuestion(dirtyQuestion, invaliQuestionIds) {
            if (!dirtyQuestion.questionMaskExpression ||
                !arrayUtilSvc.isArrayHasElement(dirtyQuestion.questionMaskExpression.expressionItems)) return;
            var expressionItemsUseRemovedQuestion = dirtyQuestion.questionMaskExpression.expressionItems.filter(function (expressionItem) {
                return invaliQuestionIds.indexOf(expressionItem.questionId) >= 0;
            });

            if (expressionItemsUseRemovedQuestion && expressionItemsUseRemovedQuestion.length > 0) {
                dirtyQuestion.questionMaskExpression = null;
            }
        }

        function getQuestionsBeforePageId(pageId) {
            var questions = [],
                pages = surveyEditorSvc.getPages();
            for (var i = 0; i < pages.length; i++) {
                if (pages[i].id === pageId) return questions;
                questions = questions.concat(pages[i].questionDefinitions);
            }
            return questions;
        }

        function appendQuestionIntoPage(pageId, questionDefinition, questionIndex) {
            var pages = surveyEditorSvc.getPages();
            for (var i = 0; i < pages.length; i++) {
                if (pages[i].id === pageId && pages[i].questionDefinitions) {
                    pages[i].questionDefinitions.splice(questionIndex, 0, questionDefinition);
                    return;
                }
            }
        }

        function isThankYouPage(page) {
            return page.nodeType === 'ThankYouPage';
        }

        function isThankYouPageById(pageId) {
            var page = service.getPageById(pageId);
            return angular.isObject(page) ? isThankYouPage(page) : false;
        }

        function handleRemoveSkipCommandInPage(skipCommand) {
            removeSkipCommandInPage();
            surveyEditorSvc.refreshSummarySkipCommandsInSurvey();
            return;

            function removeSkipCommandInPage() {
                var page = getPageById(skipCommand.pageDefinitionId);

                if (!page) return;

                for (var i = 0; i < page.skipCommands.length; i++) {
                    if (skipCommand.clientId === page.skipCommands[i].clientId) {
                        page.skipCommands.splice(i, 1);
                        break;
                    }
                }
            }
        }

        function getQuestionIdsInPage(pageId) {
            var questionIds = [];

            var page = getPageById(pageId);
            if (!page || isThankYouPage(page)) return questionIds;

            page.questionDefinitions.forEach(function (question) {
                questionIds.push(question.id);
            });

            return questionIds;
        }

        function updatePageSettings(currentPageId, newPageData) {
            var currentPage = getPageById(currentPageId);
            if (!currentPage) return;

            currentPage.title = newPageData.title;
            currentPage.description = newPageData.description;
            currentPage.navigationButtonSettings = newPageData.navigationButtonSettings;
            currentPage.isFixedPosition = newPageData.isFixedPosition;
            currentPage.orderType = newPageData.orderType;
            currentPage.version = newPageData.version;
            currentPage.rowVersion = newPageData.rowVersion;

            currentPage.pageLayoutId = newPageData.pageLayoutId;
            currentPage.pageThemeId = newPageData.pageThemeId;
            currentPage.pageThemeOverrides = angular.copy(newPageData.pageThemeOverrides);
        }
    }
})();