(function () {
    'use strict';

    angular
        .module('svt')
        .directive('svtSurveyEditor', SvtSurveyEditor);

    function SvtSurveyEditor() {
        var directive = {
            restrict: 'E',
            templateUrl: 'survey/surveyEditor/survey-editor.html',
            controller: 'surveyEditorCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();