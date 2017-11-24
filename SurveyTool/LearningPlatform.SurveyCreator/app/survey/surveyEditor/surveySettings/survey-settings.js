(function () {
    angular
        .module('svt')
        .directive('surveySettings', SurveySettings);

    function SurveySettings() {
        var directive = {
            restrict: 'E',
            scope: {
                surveyId: '@',
                handleAfterSave: '&'
            },
            templateUrl: 'survey/surveyEditor/surveySettings/survey-settings.html',
            controller: 'surveySettingsCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();