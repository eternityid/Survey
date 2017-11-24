(function () {
    'use strict';

    angular
        .module('svt')
        .factory('fromLibraryDataSvc', fromLibraryDataSvc);

    fromLibraryDataSvc.$inject = ['$resource', 'host'];

    function fromLibraryDataSvc($resource, host) {
        var dataService = {
            getLibraryPages: getLibraryPages,
            getLibraryQuestions: getLibraryQuestions,
            importLibraryPages: importLibraryPages,
            importLibraryQuestions: importLibraryQuestions
        };

        return dataService;

        function getLibraryPages() {
            return $resource(host + '/library/pages', {}, { 'getLibraryPages': { method: 'GET', isArray: true } })
                .getLibraryPages();
        }

        function getLibraryQuestions() {
            return $resource(host + '/library/questions', {}, { 'getLibraryQuestions': { method: 'GET', isArray: true } })
                .getLibraryQuestions();
        }

        function importLibraryPages(libraryPageParameter) {
            return $resource(host + '/surveys/:surveyId/folders/:folderId/pages/duplicate',
               { surveyId: '@surveyId', folderId: '@folderId' },
               { 'importLibraryPages': { method: 'POST', transformResponse: transformResponse, headers: { 'If-Match': libraryPageParameter.folderVersion } } })
                .importLibraryPages({
                    surveyId: libraryPageParameter.surveyId,
                    folderId: libraryPageParameter.folderId
                }, JSON.stringify({
                    sourcePageIds: libraryPageParameter.sourcePageIds,
                    libraryId: libraryPageParameter.libraryId,
                    duplicatePoint: libraryPageParameter.duplicatePoint
                }));
        }

        function importLibraryQuestions(libraryQuestionsParameter) {
            return $resource(host + '/surveys/:surveyId/pages/:pageId/questions/duplicate',
                { surveyId: '@surveyId', pageId: '@pageId' },
                { 'importLibraryQuestions': { method: 'POST', transformResponse: transformResponse, headers: { 'If-Match': libraryQuestionsParameter.pageVersion } } })
                .importLibraryQuestions({
                    surveyId: libraryQuestionsParameter.surveyId,
                    pageId: libraryQuestionsParameter.pageId
                }, JSON.stringify({
                    sourceQuestionIds: libraryQuestionsParameter.questionIds,
                    libraryId: libraryQuestionsParameter.libraryId
                }));
        }

        function transformResponse(data, headerGetters) {
            return {
                data: data,
                headers: headerGetters()
            };
        }
    }
})();