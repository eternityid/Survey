(function () {
    angular
        .module('svt')
        .directive('newLibrarySurvey', NewLibrarySurvey);

    function NewLibrarySurvey() {
        var directive = {
            restrict: 'E',
            scope: {
                selectedSurvey: "=",
                libraryId: "=",
                newSurveyCurrentName: "="
            },
            templateUrl: 'survey/surveyList/createNewSurvey/librarySurvey/new-library-survey.html',
            controller: 'newLibrarySurveyCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();