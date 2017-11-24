(function () {
    'use strict';

    angular
        .module('svt')
        .directive('previewSurvey', PreviewSurvey);

    function PreviewSurvey() {
        var directive = {
            restrict: 'E',
            scope: {
                selectSurveyId: '=',
                libraryId: '=?'
            },
            transclude: true,
            templateUrl: 'survey/surveyList/createNewSurvey/previewSurvey/preview-survey.html',
            controller: 'previewSurveyCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();