(function () {
    'use strict';

    angular
        .module('svt')
        .factory('reportListDataSvc', reportListDataSvc);

    reportListDataSvc.$inject = ['$resource', 'host'];

    function reportListDataSvc($resource, host) {
        var dataService = {
            search: search,
            addReport: addReport,
            editReport: editReport
        };

        return dataService;

        function addReport(report) {
            return $resource(host + '/reports/:reportId/definition', { reportId: '@reportId' }, { 'addReport': { method: 'POST' } })
                     .addReport({ reportId: 0 }, JSON.stringify(report));
        }

        function editReport(report) {
            return $resource(host + '/reports/:reportId/definition', { reportId: '@reportId' }, { 'editReport': { method: 'PUT' } })
                     .editReport({ reportId: report.id }, JSON.stringify(report));
        }

        function search(searchModel) {
            return $resource(host + '/reports', {}, { 'search': { method: 'POST' } })
                    .search({}, JSON.stringify(searchModel));
        }
    }
})();