(function () {
    'use strict';

    angular
        .module('svt')
        .directive('dateEditor', DateEditor);

    function DateEditor() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/date/date-editor.html',
            controller: 'dateEditorCtrl',
            controllerAs: 'vm',
            link: link
        };

        return directive;

        function link($scope) {
            $scope.$emit('event:DoneRenderQuestionEditor');
        }
    }
})();