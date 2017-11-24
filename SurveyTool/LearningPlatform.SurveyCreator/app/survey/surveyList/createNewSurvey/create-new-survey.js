(function () {
    'use strict';

    angular
        .module('svt')
        .directive('createNewSurvey', createNewSurvey);

    function createNewSurvey() {
        var directive = {
            restrict: 'E',
            scope: {
                surveyId: '@',
                handleAfterSave: '&'
            },
            templateUrl: 'survey/surveyList/createNewSurvey/create-new-survey.html',
            controller: 'createNewSurveyCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();