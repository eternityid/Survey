(function () {
    'use strict';

    angular.module('svt').directive('ratingEditor', RatingEditor);

    function RatingEditor() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/rating/rating-editor.html',
            controller: 'ratingEditorCtrl',
            controllerAs: 'vm',
            link: link
        };

        return directive;

        function link($scope) {
            $scope.$emit('event:DoneRenderQuestionEditor');
        }
    }
})();