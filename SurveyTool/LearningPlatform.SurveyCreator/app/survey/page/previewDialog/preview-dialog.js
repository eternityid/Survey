(function () {
    'use strict';

    angular
        .module('svt')
        .directive('previewDialog', previewDialog);

    function previewDialog() {
        var directive = {
            restrict: 'E',
            transclude: true,
            templateUrl: 'survey/page/previewDialog/preview-dialog.html',
            controller: 'previewDialogCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();