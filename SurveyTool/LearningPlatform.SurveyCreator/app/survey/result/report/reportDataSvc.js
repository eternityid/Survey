(function () {
    'use strict';

    angular.module('svt').factory('reportDataSvc', reportDataSvc);

    reportDataSvc.$inject = ['$resource', 'host'];

    function reportDataSvc($resource, host) {
        return {
            getData: getData,
            getDataForTable: getDataForTable,
            updateQuestionViewChart: updateQuestionViewChart,
            updateReportByViewTable: updateReportByViewTable
        };



        function getData(surveyId, testMode) {
            return $resource(host + '/surveys/:surveyId/result/aggregated-respondents', { surveyId: '@surveyId', testMode: testMode }, { 'getData': { method: 'GET' } })
                    .getData({ surveyId: surveyId });
        }

        function getDataForTable(surveyId, questionKey, limit, testMode) {
            return $resource(host + '/surveys/:surveyId/result/open-responses?questionKey=:questionKey&limit=:limit&testMode=:testMode', { surveyId: '@surveyId', questionKey: '@questionKey', limit: '@limit', testMode: '@testMode' }, { 'getData': { method: 'GET', isArray: true } })
                    .getData({ surveyId: surveyId, questionKey: questionKey, limit: limit, testMode: testMode });
        }

        function updateQuestionViewChart(surveyId, reportQuestionSetting) {
            return $resource(host + '/surveys/:surveyId/result/element-settings', { surveyId: '@surveyId' }, { 'updateQuestionViewChart': { method: 'PUT' } })
                    .updateQuestionViewChart({ surveyId: surveyId }, JSON.stringify(reportQuestionSetting));
        }

        function updateReportByViewTable(surveyId, reportPageSetting) {
            return $resource(host + '/surveys/:surveyId/result/settings', { surveyId: '@surveyId' }, { 'updateReportByViewTable': { method: 'PATCH' } })
                    .updateReportByViewTable({ surveyId: surveyId }, JSON.stringify(reportPageSetting));
        }
    }

})();