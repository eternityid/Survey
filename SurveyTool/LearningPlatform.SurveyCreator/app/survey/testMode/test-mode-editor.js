(function () {
    'use strict';

    angular
        .module('svt')
        .directive('svtTestModeEditor', SvtTestModeEditor);

    function SvtTestModeEditor() {
        var directive = {
            restrict: 'E',
            templateUrl: 'survey/testMode/test-mode-editor.html',
            controller: 'testModeEditorCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();