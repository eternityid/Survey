(function () {
    'use strict';

    angular
        .module('svt')
        .directive('scaleGridQuestion', scaleGridQuestion);

    function scaleGridQuestion() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/scale/scale-grid-question.html',
            controller: 'scaleGridQuestionCtrl',
            controllerAs: 'gridCtrl'
        };

        return directive;
    }
})();