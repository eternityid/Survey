(function () {
    angular
        .module('svt')
        .directive('newExistingSurvey', NewExistingSurvey);

    function NewExistingSurvey() {
        var directive = {
            restrict: 'E',
            scope: {
                selectedSurvey: "=",
                newSurveyCurrentName: "="
            },
            templateUrl: 'survey/surveyList/createNewSurvey/existingSurvey/new-existing-survey.html',
            controller: 'newExistingSurveyCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();