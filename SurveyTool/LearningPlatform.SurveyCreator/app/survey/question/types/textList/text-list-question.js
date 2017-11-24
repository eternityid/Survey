(function () {
    'use strict';

    angular
        .module('svt')
        .directive('textListQuestion', TextListQuestion);

    function TextListQuestion() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/textList/text-list-question.html',
            controller: 'textListQuestionCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();