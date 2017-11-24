(function () {
    'use strict';
    angular.module('svt').directive('rsOpenTextQuestion', rsOpenTextQuestion);

    function rsOpenTextQuestion() {
        var directive = {
            restrict: 'E',
            scope: {
                surveyId: '@',
                questionKey: '@',
                total: '@',
                aggregatedQuestion: '=',
                reportPageId: '=',
                columnWidth: '='
            },
            templateUrl: 'survey/result/openTextQuestion/rs-open-text-question.html',
            controller: 'rsOpenTextQuestionCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();