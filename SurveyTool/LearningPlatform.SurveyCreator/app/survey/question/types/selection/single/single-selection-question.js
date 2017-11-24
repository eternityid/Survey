(function () {
    'use strict';

    angular
        .module('svt')
        .directive('singleSelectionQuestion', singleSelectionPage);

    function singleSelectionPage() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/selection/single/single-selection-question.html',
            controller: 'singleSelectionQuestionCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();