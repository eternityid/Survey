(function() {
    angular.module('svt').directive('reportTable', reportTable);

    function reportTable() {
        var directive = {
            restrict: 'E',
            scope: {
                questionType: '@',
                aggregatedQuestion: '=',
                show: '@',
                editableLabels: '='
            },
            templateUrl: 'survey/result/report/report-table.html',
            controller: 'reportTableCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();
