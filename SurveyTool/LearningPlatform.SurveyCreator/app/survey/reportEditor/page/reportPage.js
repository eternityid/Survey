(function () {
    'use strict';

    angular.module('svt').directive('reportPage', reportPage);

    function reportPage() {
        var directive = {
            restrict: 'E',
            templateUrl: 'survey/reportEditor/page/reportPage.html',
            scope: {
                pageIndex: '='
            },
            controller: 'reportPageCtrl',
            controllerAs: 'reportPageCtrl'
        };

        return directive;
    }
})();