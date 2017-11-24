(function () {
    'use strict';

    angular
        .module('svt')
        .directive('multipleSelectionQuestion', multipleSelectionQuestion);

    function multipleSelectionQuestion() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/selection/multiple/multiple-selection-question.html',
            controller: 'multipleSelectionQuestionCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();