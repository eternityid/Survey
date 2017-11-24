(function () {
    'use strict';

    angular
        .module('svt')
        .directive('ratingGridQuestion', RatingGridQuestion);

    function RatingGridQuestion() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/rating/rating-grid-question.html',
            controller: 'ratingGridQuestionCtrl',
            controllerAs: 'gridCtrl'
        };

        return directive;
    }
})();