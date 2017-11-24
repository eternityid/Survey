(function () {
    'use strict';

    angular
        .module('svt')
        .factory('pageDataSvc', pageDataSvc);

    pageDataSvc.$inject = ['$resource', 'host'];

    function pageDataSvc($resource, host) {
        var dataService = {
            addPage: addPage,
            updatePage: updatePage,
            updateSkipCommands: updateSkipCommands,
            deletePage: deletePage,
            movePage: movePage,
            duplicateQuestion: duplicateQuestion,
            splitPage: splitPage,
            mergePage: mergePage
        };

        return dataService;

        function addPage(folder, pageIndex, pageTitle) {
            return $resource(host + '/surveys/:surveyId/folders/:folderId/pages',
                { surveyId: '@surveyId', folderId: '@folderId' },
                { 'AddPage': { method: 'POST', transformResponse: transformResponse, headers: { 'If-Match': folder.version } } })
                .AddPage({ surveyId: folder.surveyId, folderId: folder.id }, JSON.stringify({ pageIndex: pageIndex, pageTitle: pageTitle }));
        }

        function updatePage(folderId, pageAndTheme) {
            var page = pageAndTheme.page;
            return $resource(host + '/surveys/:surveyId/folders/:folderId/pages/:pageId',
                { surveyId: '@surveyId', folderId: '@folderId', pageId: '@pageId' },
                { 'Update': { method: 'PUT', transformResponse: transformResponse, headers: { 'If-Match': page.version } } })
              .Update({ surveyId: page.surveyId, folderId: folderId, pageId: page.id }, JSON.stringify(pageAndTheme));
        }

        function updateSkipCommands(folderId, page) {
            return $resource(host + '/surveys/:surveyId/folders/:folderId/pages/:pageId/skipcommands',
                { surveyId: '@surveyId', folderId: '@folderId', pageId: '@pageId' },
                { 'Update': { method: 'PUT', transformResponse: transformResponse, headers: { 'If-Match': page.version } } })
              .Update({ surveyId: page.surveyId, folderId: folderId, pageId: page.id }, JSON.stringify(page));
        }

        function deletePage(folder, page) {
            return $resource(host + '/surveys/:surveyId/folders/:folderId/pages/:pageId',
                { surveyId: '@surveyId', folderId: '@folderId', pageId: '@pageId' },
                { 'DeleteById': { method: 'DELETE', transformResponse: transformResponse, headers: { 'If-Match': folder.version } } })
                .DeleteById({ surveyId: page.surveyId, folderId: folder.id, pageId: page.id });
        }

        function movePage(folder, item) {
            return $resource(host + '/surveys/:surveyId/folders/:folderId/pages/:pageId/move',
                { surveyId: '@surveyId', folderId: '@folderId', pageId: '@pageId' },
                { 'MovePage': { method: 'POST', transformResponse: transformResponse, headers: { 'If-Match': folder.version } } })
                .MovePage({ surveyId: item.surveyId, folderId: folder.id, pageId: item.pageId }, JSON.stringify({ newPageIndex: item.newPageIndex }));
        }

        function duplicateQuestion(surveyId, pageId, pageVersion, sourceQuestion) {
            return $resource(host + '/surveys/:surveyId/pages/:pageId/questions/:questionId/duplicate',
                { surveyId: '@surveyId', pageId: '@pageId', questionId: '@questionId' },
                { 'Duplicate': { method: 'POST', headers: { 'If-Match': pageVersion }, transformResponse: transformResponse } })
                .Duplicate({ surveyId: surveyId, pageId: pageId, questionId: sourceQuestion.questionSourceId }, JSON.stringify(sourceQuestion));
        }

        function splitPage(folder, page, splitPoint, pageTitle) {
            var payload = {
                pageEtag: page.version,
                splitPoint: splitPoint,
                pageTitle: pageTitle
            };
            return $resource(host + '/surveys/:surveyId/folders/:folderId/pages/:pageId/split',
                {
                    surveyId: '@surveyId',
                    folderId: '@folderId',
                    pageId: '@pageId'
                },
                { 'SplitPage': { method: 'POST', transformResponse: transformResponse, headers: { 'If-Match': folder.version } } })
                .SplitPage({
                    surveyId: page.surveyId,
                    folderId: folder.id,
                    pageId: page.id
                }, JSON.stringify(payload));
        }

        function mergePage(folder, firstPage, secondPage) {
            var parameters = {
                firstPageEtag: firstPage.version,
                secondPageId: secondPage.id,
                secondPageEtag: secondPage.version
            };
            return $resource(host + '/surveys/:surveyId/folders/:folderId/pages/:pageId/merge',
                {
                    surveyId: '@surveyId',
                    folderId: '@folderId',
                    pageId: '@pageId'
                },
                { 'MergePage': { method: 'POST', headers: { 'If-Match': folder.version }, transformResponse: transformResponse } })
                .MergePage({
                    surveyId: firstPage.surveyId,
                    folderId: folder.id,
                    pageId: firstPage.id
                }, JSON.stringify(parameters));
        }

        function transformResponse(data, headerGetters) {
            return {
                data: data,
                headers: headerGetters()
            };
        }
    }
})();