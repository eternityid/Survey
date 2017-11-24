(function () {
    'use strict';

    angular
        .module('svt')
        .directive('selectionEditor', SelectionEditor);

    function SelectionEditor() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/selection/selection-editor.html',
            controller: 'selectionEditorCtrl',
            controllerAs: 'vm',
            link: link
        };

        return directive;

        function link($scope) {
            if (!$scope.question.optionList ||
                $scope.question.optionList.options.length === 0) return;
            $scope.$watch(function () {
                return angular.element('.selection-option__option-item .container-text-option').length +
                    angular.element('.selection-option__option-item .carry-over-option-label').length;
            }, function (value) {
                if (value >= $scope.question.optionList.options.length) {
                    $scope.$emit('event:DoneRenderQuestionEditor');
                }
            });
        }
    }
})();