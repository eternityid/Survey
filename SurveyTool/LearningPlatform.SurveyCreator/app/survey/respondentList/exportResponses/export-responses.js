(function () {
    'use strict';

    angular
        .module('svt')
        .directive('exportResponses', exportResponses);

    function exportResponses() {
        var directive = {
            restrict: 'E',
            scope: {
                surveyId: '@',
                surveyName: '@',
                handleAfterSave: '&'
            },
            templateUrl: 'survey/respondentList/exportResponses/export-responses.html',
            controller: 'exportResponsesCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();