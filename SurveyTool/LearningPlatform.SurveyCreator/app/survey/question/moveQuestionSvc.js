(function () {
    angular.module('svt').service('moveQuestionSvc', MoveQuestionSvc);
    MoveQuestionSvc.$inject = [
        'surveyEditorSvc', 'surveyEditorPageSvc'
    ];

    function MoveQuestionSvc(
        surveyEditorSvc, surveyEditorPageSvc
        ) {
        var service = {
            handleDoneMoveQuestionsInPage: handleDoneMoveQuestionsInPage,
            handleDoneMoveQuestionToAnotherPage: handleDoneMoveQuestionToAnotherPage
        };
        return service;

        function handleDoneMoveQuestionsInPage(data) {
            surveyEditorSvc.setSurveyVersion(data.surveyVersion);

            var page = surveyEditorPageSvc.getPageById(data.pageId);
            page.version = data.pageVersion;
            sortQuestionsByQuestionIds(page, data.pageQuestionIds);

            surveyEditorSvc.setSurveyEditMode(false);
        }

        function sortQuestionsByQuestionIds(page, questionIds) {
            page.questionDefinitions.sort(function (question1, question2) {
                var index1 = questionIds.indexOf(question1.id),
                    index2 = questionIds.indexOf(question2.id);
                return index1 - index2;
            });
        }

        function handleDoneMoveQuestionToAnotherPage(data) {
            surveyEditorSvc.setSurveyVersion(data.surveyVersion);

            var sourcePage = surveyEditorPageSvc.getPageById(data.movingQuestion.pageId),
                destinationPage = surveyEditorPageSvc.getPageById(data.destinationPageId);

            data.movingQuestion.pageId = data.destinationPageId;

            sourcePage.version = data.sourcePageVersion;
            var sourceIndex = sourcePage.questionDefinitions.findIndex(function (question) {
                return question.id === data.movingQuestion.id;
            });
            if (sourceIndex >= 0) {
                sourcePage.questionDefinitions.splice(sourceIndex, 1);
            }

            destinationPage.version = data.destinationPageVersion;
            var destinationIndex = data.destinationPageQuestionIds.indexOf(data.movingQuestion.id);
            var existingIndex = destinationPage.questionDefinitions.findIndex(function (question) {
                return question.id === data.movingQuestion.id;
            });
            if (destinationIndex >= 0 && existingIndex < 0) {
                destinationPage.questionDefinitions.splice(destinationIndex, 0, data.movingQuestion);
            }

            surveyEditorSvc.setSurveyEditMode(false);
        }
    }
})();