(function () {
    'use strict';

    angular
        .module('svt')
        .directive('svtReportEditor', SvtReportEditor);

    function SvtReportEditor() {
        var directive = {
            restrict: 'E',
            templateUrl: 'survey/reportEditor/report-editor.html',
            controller: 'reportEditorCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();