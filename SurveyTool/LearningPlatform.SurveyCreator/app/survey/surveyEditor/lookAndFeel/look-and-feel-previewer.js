(function () {
    'use strict';

    angular
        .module('svt')
        .directive('lookAndFeelPreviewer', lookAndFeelPreviewer);

    function lookAndFeelPreviewer() {
        var directive = {
            restrict: 'E',
            scope: {},
            templateUrl: 'survey/surveyEditor/lookAndFeel/look-and-feel-previewer.html',
            controller: 'lookAndFeelPreviewerCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();