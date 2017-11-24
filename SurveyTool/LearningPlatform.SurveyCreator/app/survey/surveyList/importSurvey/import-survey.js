(function () {
    'use strict';

    angular
        .module('svt')
        .directive('importSurvey', importSurvey);

    function importSurvey() {
        var directive = {
            restrict: 'E',
            scope: {
                handleAfterSave: '&'
            },
            templateUrl: 'survey/surveyList/importSurvey/import-survey.html',
            controller: 'importSurveyCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();