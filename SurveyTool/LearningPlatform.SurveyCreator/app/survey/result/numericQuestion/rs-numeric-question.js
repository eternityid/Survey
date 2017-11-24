(function () {
    'use strict';
    angular.module('svt').directive('rsNumericQuestion', rsNumericQuestion);

    function rsNumericQuestion() {
        var directive = {
            restrict: 'E',
            scope: {
                aggregatedQuestion: '='
            },
            templateUrl: 'survey/result/numericQuestion/rs-numeric-question.html',
            controller: 'rsNumericQuestionCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();