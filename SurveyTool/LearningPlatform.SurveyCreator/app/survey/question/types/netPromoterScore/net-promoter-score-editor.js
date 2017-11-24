(function () {
    'use strict';

    angular.module('svt').directive('netPromoterScoreEditor', NetPromoterScoreEditor);

    function NetPromoterScoreEditor() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/netPromoterScore/net-promoter-score-editor.html',
            controller: 'netPromoterScoreEditorCtrl',
            controllerAs: 'vm',
            link: link
        };

        return directive;

        function link($scope) {
            $scope.$emit('event:DoneRenderQuestionEditor');
        }
    }
})();