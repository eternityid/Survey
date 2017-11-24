(function () {
    'use strict';

    angular
        .module('svt')
        .directive('scaleQuestion', scaleQuestion);

    function scaleQuestion() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/scale/scale-question.html',
            controller: 'scaleQuestionCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();