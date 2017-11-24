(function () {
    'use strict';

    angular
        .module('svt')
        .directive('pictureSelectionEditor', PictureSelectionEditor);

    function PictureSelectionEditor() {
        var directive =  {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/pictureSelection/picture-selection-editor.html',
            controller: 'pictureSelectionEditorCtrl',
            controllerAs: 'vm',
            link: link
        };

        return directive;

        function link($scope) {
            if (!$scope.question.optionList ||
                $scope.question.optionList.options.length === 0) return;
            $scope.$watch(function () {
                return angular.element('.selection-picture .option-title__ckeditor').length;
            }, function (value) {
                if (value >= $scope.question.optionList.options.length) {
                    $scope.$emit('event:DoneRenderQuestionEditor');
                }
            });
        }
    }
})();