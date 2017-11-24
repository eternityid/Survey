(function () {
    'use strict';

    angular
        .module('svt')
        .factory('reportPageDataSvc', reportPageDataSvc);

    reportPageDataSvc.$inject = ['$resource', 'host'];

    function reportPageDataSvc($resource, host) {
        var dataService = {
            addPage: addPage,
            deletePage: deletePage,
            getAllByReportId: getAllByReportId,
            getQuestionsByReportId: getQuestionsByReportId,
            movePage: movePage
        };

        return dataService;

        function addPage(page) {
            return $resource(host + '/reports/:reportId/definition/pages', { surveyId: '@reportId' }, { 'AddPage': { method: 'POST' } })
                .AddPage({ reportId: page.reportId }, JSON.stringify(page));
        }

        function deletePage(page) {
            return $resource(host + '/reports/:reportId/definition/pages/:pageId', { reportId: '@reportId', pageID: '@pageID' }, { 'DeleteById': { method: 'DELETE' } })
                .DeleteById({ reportId: page.reportId, pageId: page.id });
        }

        function getAllByReportId(reportId, testMode) {
            return $resource(host + '/reports/:reportId/definition/pages', { surveyId: '@reportId', testMode: testMode }, { 'GetAllByReportId': { method: 'GET', isArray: false } })
                .GetAllByReportId({ reportId: reportId });
        }

        function getQuestionsByReportId(reportId) {
            return $resource(host + '/reports/:reportId/definition/pages/questions', { surveyId: '@reportId' }, { 'GetQuestionsByReportId': { method: 'GET', isArray: true } })
                .GetQuestionsByReportId({ reportId: reportId });
        }

        function movePage(item) {
            return $resource(host + '/reports/:reportId/definition/pages/move', { reportId: '@reportId' }, { 'MovePage': { method: 'PATCH' } })
                .MovePage({ reportId: item.reportId }, JSON.stringify(item));
        }
    }
})();