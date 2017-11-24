(function () {
    'use strict';

    angular
        .module('svt')
        .directive('informationQuestion', informationQuestion);

    function informationQuestion() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/information/information-question.html'
        };

        return directive;
    }
})();