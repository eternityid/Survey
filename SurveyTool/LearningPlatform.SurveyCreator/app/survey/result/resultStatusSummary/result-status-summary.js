(function () {
    'use strict';

    angular
        .module('svt')
        .directive('resultStatusSummary', resultStatusSummary);

    function resultStatusSummary() {
        var directive = {
            restrict: 'E',
            scope: {
                surveyId: '=',
                totalResponses: '='
            },
            templateUrl: 'survey/result/resultStatusSummary/result-status-summary.html'
        };

        return directive;
    }
})();