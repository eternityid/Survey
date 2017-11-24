(function() {
    'use strict';

    angular.module('svt').directive('expressionBuilder', expressionBuilder);

    function expressionBuilder() {
        var directive = {
            restrict: 'E',
            scope: {
                expression: '=',
                question: '=',
                pageId: '=',
                backgroundOverrideColor: '@'
            },
            templateUrl: 'survey/question/expressionBuilder/expression-builder.html',
            controller: 'expressionBuilderCtrl',
            controllerAs: 'builderCtrl'
        };
        return directive;
    }
})();