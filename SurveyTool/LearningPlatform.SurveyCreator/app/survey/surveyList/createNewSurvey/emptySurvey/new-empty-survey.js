(function () {
    angular
        .module('svt')
        .directive('newEmptySurvey', NewEmptySurvey);

    function NewEmptySurvey() {
        var directive = {
            restrict: 'E',
            scope: {
                surveyTitle: '='
            },
            templateUrl: 'survey/surveyList/createNewSurvey/emptySurvey/new-empty-survey.html',
            controller: 'newEmptySurveyCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();