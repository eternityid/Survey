(function () {
    'use strict';

    angular
        .module('svt')
        .directive('ratingQuestion', ratingQuestion);

    function ratingQuestion() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/rating/rating-question.html'
        };

        return directive;
    }
})();