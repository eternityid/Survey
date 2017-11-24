(function () {
    'use strict';

    angular
        .module('svt')
        .directive('editQuestion', EditQuestion);

    EditQuestion.$inject = ['domUtilSvc'];

    function EditQuestion(domUtilSvc) {
        var directive = {
            restrict: 'E',
            scope: {
                htmlContainerId: '@',
                hideAdvanceSetting: '@',
                question: '=',
                pageId: '@'
            },
            templateUrl: 'survey/question/editQuestion/edit-question-container.html',
            controller: 'editQuestionCtrl',
            controllerAs: 'editCtrl',
            link: link
        };

        function link($scope, $element, $attrs) {
            var alreadyRun = false;

            $scope.$on('event:DoneRenderQuestionEditor', function () {
                if (alreadyRun) return;
                domUtilSvc.middleElementInScreenById('edit-question-segment');
                alreadyRun = true;
            });
        }

        return directive;
    }
})();