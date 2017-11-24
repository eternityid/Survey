(function () {
    'use strict';

    angular.module('svt').directive('expressionItem', expressionItem);

    function expressionItem() {
        var directive = {
            restrict: 'E',
            scope: {
                builder: '=',
                item: '=',
                previousItem: '=',
                onQuestionChange: '&',
                backgroundOverrideColor: '@'
            },
            templateUrl: 'survey/question/expressionBuilder/expression-item.html',
            controller: 'expressionItemCtrl',
            controllerAs: 'vm'
        };
        return directive;
    }
})();