(function () {
    'use strict';

    angular
        .module('svt')
        .factory('questionPreviewerDataSvc', questionPreviewerDataSvc);

    questionPreviewerDataSvc.$inject = ['$resource', 'baseHost', 'surveyEditorPageSvc'];

    function questionPreviewerDataSvc($resource, baseHost, surveyEditorPageSvc) {
        return {
            previewQuestion: previewQuestion
        };

        function previewQuestion(question) {
            var page = angular.copy(surveyEditorPageSvc.getPageById(question.pageId));
            var navigateButtonSettings = {
                none: '2'
            };
            page.navigationButtonSettings = navigateButtonSettings.none;
            page.skipCommands.length = 0;
            page.questionDefinitions = [question];

            var pagePreviewBindingModel = {
                page: page,
                temporaryPictures: question.temporaryPictures
            };

            return $resource(baseHost + '/survey/:surveyId/preview/language/en', { surveyId: '@surveyId' }, { 'preview': { method: 'POST', transformResponse: transformResponse } })
                .preview({ surveyId: question.surveyId }, JSON.stringify(pagePreviewBindingModel));

            function transformResponse(data) {
                return data === 'null' ? { data: null } : { data: data };
            }
        }
    }
})();