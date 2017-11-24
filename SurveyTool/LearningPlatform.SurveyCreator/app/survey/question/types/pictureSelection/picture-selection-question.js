(function () {
    'use strict';

    angular
        .module('svt')
        .directive('pictureSelectionQuestion', PictureSelectionQuestion);

    function PictureSelectionQuestion() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/types/pictureSelection/picture-selection-question.html',
            controller: 'pictureSelectionQuestionCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();