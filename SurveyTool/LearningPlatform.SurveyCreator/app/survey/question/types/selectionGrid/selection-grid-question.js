(function () {
    'use strict';
    angular.module('svt').directive('selectionGridQuestion', selectionGridQuestion);

    function selectionGridQuestion() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '=',
                selectionType: '@'
            },
            templateUrl: 'survey/question/types/selectionGrid/selection-grid-question.html',
            controller: 'selectionGridQuestionCtrl',
            controllerAs: 'gridCtrl'
        };

        return directive;
    }
})();