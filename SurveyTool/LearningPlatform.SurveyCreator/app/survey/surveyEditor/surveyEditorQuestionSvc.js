(function () {
    angular.module('svt').service('surveyEditorQuestionSvc', surveyEditorQuestionSvc);
    surveyEditorQuestionSvc.$inject = ['surveyEditorSvc', 'surveyEditorPageSvc', 'arrayUtilSvc'];

    function surveyEditorQuestionSvc(surveyEditorSvc, surveyEditorPageSvc, arrayUtilSvc) {
        var service = {
            getOptionIdsOfQuestion: getOptionIdsOfQuestion,
            handleDoneCreateQuestion: handleDoneCreateQuestion,
            handleDoneUpdateQuestion: handleDoneUpdateQuestion,
            handleRemoveQuestion: handleRemoveQuestion
        };
        return service;

        function getOptionIdsOfQuestion(questionHaveOptions) {
            return questionHaveOptions.optionList ?
                questionHaveOptions.optionList.options.map(function (option) {
                    return option.id;
                }) : [];
        }

        function handleDoneCreateQuestion() {
            surveyEditorSvc.setSurveyEditMode(false);
            surveyEditorSvc.setQuestionEditorId(null);
            surveyEditorSvc.refreshSummaryDataForSurvey();
            surveyEditorSvc.setupQuestionPositionInSurvey();
        }

        function handleDoneUpdateQuestion(updatedQuestion) {
            surveyEditorSvc.setSurveyEditMode(false);
            surveyEditorSvc.setQuestionEditorId(null);
            refreshReferencedDataToQuestion(updatedQuestion);
            surveyEditorSvc.refreshSummaryDataForSurvey();
            surveyEditorSvc.setupQuestionPositionInSurvey();
        }

        function refreshReferencedDataToQuestion(updatedOrRemovedQuestion) {
            var optionIds = getOptionIdsInQuestion(updatedOrRemovedQuestion);
            var pages = surveyEditorSvc.getPages();
            pages.forEach(function (page) {
                refreshSkipActionUseQuestionAndOption(page, updatedOrRemovedQuestion.id, optionIds);
                var questions = surveyEditorPageSvc.getQuestionsByPageId(page.id);
                questions.forEach(function (question) {
                    updateDataChangedForQuestionMark(question, updatedOrRemovedQuestion.id);
                    refreshCarryOverTitleForQuestion(question, updatedOrRemovedQuestion.id);
                });
            });
        }

        function getOptionIdsInQuestion(question) {
            return question.optionList ?
                question.optionList.options.map(function (option) {
                    return option.id;
                }) :
                [];
        }

        function refreshSkipActionUseQuestionAndOption(page, questionId, optionIdsInQuestion) {
            page.skipCommands.forEach(function (skipCommand) {
                var isDataChanged = false;
                if (skipCommand.skipToQuestionId === questionId) {
                    isDataChanged = true;
                } else {
                    skipCommand.expression.expressionItems.forEach(function (expressionItem) {
                        if (expressionItem.questionId === questionId ||
                            optionIdsInQuestion.indexOf(expressionItem.optionId) >= 0) {
                            isDataChanged = true;
                            return;
                        }
                    });
                }
                if (isDataChanged) {
                    skipCommand.lastDataChanged = new Date();
                }
            });
        }

        function updateDataChangedForQuestionMark(question, questionId) {
            if (!question.questionMaskExpression) return;
            for (var i = 0; i < question.questionMaskExpression.expressionItems.length; i++) {
                if (question.questionMaskExpression.expressionItems[i].questionId === questionId) {
                    question.questionMaskExpression.lastRelatedDataChanged = new Date();
                    return;
                }
            }
        }

        function refreshCarryOverTitleForQuestion(question, questionId) {
            if (question.optionList) {
                if (haveOptionCarryOverFrom(question.optionList.options, questionId)) {
                    question.optionList.referenceDataChanged = new Date();
                    return;
                }
            }
            if (question.subQuestionDefinition && question.subQuestionDefinition.optionList) {
                if (haveOptionCarryOverFrom(question.subQuestionDefinition.optionList.options, questionId)) {
                    question.subQuestionDefinition.optionList.referenceDataChanged = new Date();
                }
            }
            return;

            function haveOptionCarryOverFrom(options, sourceQuestionId) {
                return options.some(function (option) {
                    return option.optionsMask &&
                        option.optionsMask.questionId === sourceQuestionId;
                });
            }
        }

        function handleRemoveQuestion(removedQuestion, questionsInPage) {
            removeQuestion();
            refreshReferencedDataToQuestion(removedQuestion);
            surveyEditorSvc.refreshSummaryDataForSurvey();
            surveyEditorSvc.setupQuestionPositionInSurvey();
            return;

            function removeQuestion() {
                for (var i = 0; i < questionsInPage.length; i++) {
                    if (questionsInPage[i].id === removedQuestion.id) {
                        questionsInPage.splice(i, 1);
                        return;
                    }
                }
            }
        }
    }
})();