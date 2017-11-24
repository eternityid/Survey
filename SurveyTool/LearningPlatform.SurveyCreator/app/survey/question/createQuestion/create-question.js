(function () {
    'use strict';

    angular
        .module('svt')
        .directive('createQuestion', CreateQuestion);
    CreateQuestion.$inject = ['domUtilSvc'];

    function CreateQuestion(domUtilSvc) {
        var directive = {
            restrict: 'E',
            scope: {
                htmlContainerId: '@',
                questionType: '@',
                pageId: '@',
                position: '@',
                index: '@'
            },
            templateUrl: 'survey/question/createQuestion/create-question-container.html',
            controller: 'createQuestionCtrl',
            controllerAs: 'createQuestionCtrl',
            link: link
        };

        function link($scope, $element, $attrs) {
            var alreadyRun = false;

            $scope.$on('event:DoneRenderQuestionEditor', function () {
                if (alreadyRun) return;
                domUtilSvc.middleElementInScreenById('create-question-segment');
                alreadyRun = true;
            });
        }

        return directive;
    }
})();