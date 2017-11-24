(function () {
    'use strict';

    angular
        .module('svt')
        .directive('createReport', createReport);

    function createReport() {
        var directive = {
            restrict: 'E',
            scope: {
                editor: '=',
                handleAfterSave: '&'
            },
            templateUrl: 'survey/reportList/createReport/create-report.html',
            controller: 'createReportCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();