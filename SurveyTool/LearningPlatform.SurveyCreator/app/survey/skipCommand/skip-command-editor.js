(function () {
    'use strict';

    angular
        .module('svt')
        .directive('skipCommandEditor', SkipCommandEditor);

    SkipCommandEditor.$inject = ['domUtilSvc'];

    function SkipCommandEditor(domUtilSvc) {
        var directive = {
            restrict: 'E',
            scope: {
                htmlContainerId: '@',
                pageId: '@',
                blockId: '@',
                skipCommand: '='
            },
            templateUrl: 'survey/skipCommand/skip-command-editor.html',
            controller: 'skipCommandEditorCtrl',
            controllerAs: 'vm',
            link: function (scope, element) {
                var alreadyRun = false;
                scope.$watch(function () {
                    return angular.element('.skip-command-edit').is(':visible') &&
                        angular.element('.expression-item').is(':visible');
                }, function (newValue) {
                    if (newValue && !alreadyRun) {
                        domUtilSvc.middleElementInScreenById('skip-command-editor-segment');
                        alreadyRun = true;
                    }
                });
            }
        };

        return directive;
    }
})();