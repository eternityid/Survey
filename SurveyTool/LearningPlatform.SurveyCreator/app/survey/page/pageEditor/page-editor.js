(function () {
    'use strict';

    angular
        .module('svt').directive('pageEditor', PageEditor);
    PageEditor.$inject = ['domUtilSvc'];

    function PageEditor(domUtilSvc) {
        var directive = {
            restrict: 'E',
            templateUrl: 'survey/page/pageEditor/page-editor.html',
            scope: {
                pageObj: '=',
                blockId: '@',
                navigationButtonSettings: '=',
                questionOrders: '='
            },
            controller: 'pageEditorCtrl',
            controllerAs: 'vm',
            link: function (scope, element) {
                var alreadyRun = false;
                scope.$watch(function () {
                    return angular.element('.page-editor-container').is(':visible') &&
                        angular.element('#gs').is(':visible');
                }, function (newValue) {
                    if (newValue && !alreadyRun) {
                        domUtilSvc.middleElementInScreenById('page-editor-segment');
                        alreadyRun = true;
                    }
                });
            }
        };

        return directive;
    }
})();