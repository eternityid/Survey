(function () {
    'use strict';

    angular
        .module('svt')
        .directive('surveyTitleAndStatus', surveyTitleAndStatus);

    function surveyTitleAndStatus() {
        var directive = {
            restrict: 'E',
            scope: {
                surveyId: '='
            },
            templateUrl: 'survey/surveyTitleAndStatus/survey-title-and-status.html',
            controller: 'surveyTitleAndStatusCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();