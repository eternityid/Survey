(function () {
    'use strict';

    angular
        .module('svt')
        .directive('textQuestion', TextQuestion);

    function TextQuestion() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/text/text-question.html',
            controller: 'textQuestionCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();