(function () {
    'use strict';

    angular
        .module('svt')
        .directive('numericEditor', NumericEditor);

    function NumericEditor() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            controller: 'numericEditorCtrl',
            controllerAs: 'vm',
            link: link
        };

        return directive;

        function link($scope) {
            $scope.$emit('event:DoneRenderQuestionEditor');
        }
    }
})();