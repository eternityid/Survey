(function () {
    'use strict';

    angular
        .module('svt')
        .directive('selectionGridEditor', SelectionGridEditor);

    function SelectionGridEditor() {
        var directive = {
            restrict: 'E',
            scope: {
                isSingleSelectionGridQuestion: '@',
                question: '='
            },
            templateUrl: 'survey/question/types/selectionGrid/selection-grid-editor.html',
            controller: 'selectionGridEditorCtrl',
            controllerAs: 'vm',
            link: link
        };

        return directive;

        function link($scope) {
            if (!$scope.question.optionList ||
                $scope.question.optionList.options.length === 0 ||
                !$scope.question.subQuestionDefinition.optionList ||
                $scope.question.subQuestionDefinition.optionList.options.length === 0) return;
            $scope.$watch(function () {
                return angular.element('.selection-option__option-item .container-text-option').length +
                    angular.element('.selection-option__option-item .carry-over-option-label').length;
            }, function (value) {
                if (value >= $scope.question.optionList.options.length + $scope.question.subQuestionDefinition.optionList.options.length) {
                    $scope.$emit('event:DoneRenderQuestionEditor');
                }
            });
        }
    }
})();