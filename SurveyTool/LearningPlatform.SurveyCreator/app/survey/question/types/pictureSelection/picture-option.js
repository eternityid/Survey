(function () {
    'use strict';

    angular
        .module('svt')
        .directive('pictureOption', PictureOption);

    function PictureOption() {
        var directive =  {
            restrict: 'E',
            scope: {
                index: '@',
                openningOption: '=',
                question: '=',
                options: '=',
                onKeyDownOnOptionAliasField: '&'
            },
            templateUrl: 'survey/question/types/pictureSelection/picture-option.html',
            controller: 'pictureOptionCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();