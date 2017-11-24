(function () {
    'use strict';

    angular
        .module('svt')
        .directive('pictureOptionList', PictureOptionList);

    function PictureOptionList() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '=',
                options: '=',
                openningOption: '='
            },
            templateUrl: 'survey/question/types/pictureSelection/picture-option-list.html',
            controller: 'pictureOptionListCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }

})();