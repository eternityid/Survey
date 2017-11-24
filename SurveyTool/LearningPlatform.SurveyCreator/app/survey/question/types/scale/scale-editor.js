(function () {
    'use strict';

    angular.module('svt').directive('scaleEditor', scaleEditor);

    function scaleEditor() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/scale/scale-editor.html',
            controller: 'scaleEditorCtrl',
            controllerAs: 'vm',
            link: link
        };

        return directive;

        function link($scope) {
            $scope.$emit('event:DoneRenderQuestionEditor');
        }
    }
})();