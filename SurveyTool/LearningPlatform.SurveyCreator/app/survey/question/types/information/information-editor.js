(function () {
    'use strict';

    angular
        .module('svt')
        .directive('informationEditor', informationEditor);

    function informationEditor() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            controller: 'informationEditorCtrl',
            controllerAs: 'vm',
            link: link
        };

        return directive;

        function link($scope) {
            $scope.$emit('event:DoneRenderQuestionEditor');
        }
    }
})();