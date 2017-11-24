(function () {
    'use strict';

    angular
        .module('svt')
        .directive('textEditor', TextEditor);

    function TextEditor() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/text/text-editor.html',
            controller: 'textEditorCtrl',
            controllerAs: 'vm',
            link: link
        };

        return directive;

        function link($scope) {
            $scope.$emit('event:DoneRenderQuestionEditor');
        }
    }
})();