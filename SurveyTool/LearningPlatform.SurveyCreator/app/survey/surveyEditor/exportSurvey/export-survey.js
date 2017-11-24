(function () {
    'use strict';

    angular
        .module('svt')
        .directive('exportSurvey', exportSurvey);

    function exportSurvey() {
        var directive = {
            restrict: 'E',
            scope: {
                surveyId: '@',
                surveyName: '@'
            },
            templateUrl: 'survey/surveyEditor/exportSurvey/export-survey.html',
            controller: 'exportSurveyCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();