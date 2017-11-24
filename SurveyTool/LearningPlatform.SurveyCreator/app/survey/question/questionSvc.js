(function () {
    angular
        .module('svt')
        .service('questionSvc', questionSvc);

    questionSvc.$inject = [
        'surveyEditorSvc'
    ];

    function questionSvc(surveyEditorSvc) {
        var activeQuestion = { questionId: null };

        var selectedSurveyId = null;

        var service = {
            setSelectedSurveyId: setSelectedSurveyId,
            getSelectedSurveyId: getSelectedSurveyId,
            setActiveQuestion: setActiveQuestion,
            getActiveQuestion: getActiveQuestion,
            getQuestionTitle: getQuestionTitle,
            getDefaultOptionsMask: getDefaultOptionsMask,
            getMovingPositionByStep: getMovingPositionByStep,
            duplicateQuestionExceptId: duplicateQuestionExceptId
        };

        return service;

        function getQuestionTitle(questionId) {
            var questionTitlesInSurvey = surveyEditorSvc.getData().questionTitlesInSurvey,
                title = "";
            questionTitlesInSurvey.forEach(function (item) {
                if (item.id === questionId) {
                    title = item.title;
                    return;
                }
            });
            return title;
        }

        function setSelectedSurveyId(surveyId) {
            selectedSurveyId = surveyId;
        }

        function getSelectedSurveyId() {
            return selectedSurveyId;
        }

        function setActiveQuestion(activeQuestionId) {
            activeQuestion.questionId = activeQuestionId;
        }

        function getActiveQuestion() {
            return activeQuestion;
        }

        function getDefaultOptionsMask() {//TODO remove me later
            return {
                $type: 'OptionsMask',
                customOptionsMask: null,
                optionsMaskType: null,
                questionId: null,
                isUseOptionMask: false,
                isCustomOptionsMask: false,//TODO remove it
                title: ''
            };
        }

        function getMovingPositionByStep(isPageNext, pageDefinitionId, pages) {
            var index = -1;
            for (var i = 0; i < pages.length; i++) {
                if (pages[i].id === pageDefinitionId) {
                    if (isPageNext && i < pages.length - 1) {
                        index = i + 1; break;
                    } else if (!isPageNext && i > 0) {
                        index = i - 1; break;
                    }
                }
            }
            if (index < 0) return null;

            var page = pages[index];
            return {
                pageDefinitionId: page.id,
                index: isPageNext ? 0 : (page.questionDefinitions ? page.questionDefinitions.length : 0),
                pageDefinitionVersion: page.version
            };
        }

        function duplicateQuestionExceptId(sourceQuestion) {
            return {
                questionSourceId: sourceQuestion.id,
                alias : surveyEditorSvc.generateQuestionAliasAuto()
            };
        }
    }
})();