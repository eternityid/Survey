(function () {
    'use strict';

    angular
        .module('svt')
        .directive('numericQuestion', numericQuestion);

    function numericQuestion() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/numeric/numeric-question.html'
        };

        return directive;
    }
})();