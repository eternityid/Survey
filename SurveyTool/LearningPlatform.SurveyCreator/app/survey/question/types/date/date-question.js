(function () {
    'use strict';

    angular
        .module('svt')
        .directive('dateQuestion', DateQuestion);

    function DateQuestion() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/date/date-question.html',
            controller: 'dateQuestionCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();