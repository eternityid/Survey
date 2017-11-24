(function () {
    'use strict';

    angular
        .module('svt')
        .directive('headerOption', HeaderOption);

    function HeaderOption() {
        var directive = {
            restrict: 'E',
            scope: {
                option: '=',
                onTitleChange: '&',
                onRemoveGroupHeader: '&',
                editorConfig: '=',
                onOrderOptionChange: '&',
                onToggle: '&'
            },
            templateUrl: 'survey/question/types/selection/header-option.html',
            link: function (scope, elem, attrs) {
                scope.onClickToggleIcon = function () {
                    scope.onToggle();
                    scope.option.isOpened = scope.option.isOpened ? false : true;
                };
                scope.questionOrders = [
                     { code: 0, name: 'In Order' },
                     { code: 1, name: 'Randomized' },
                     { code: 2, name: 'Flipped' },
                     { code: 3, name: 'Rotated' },
                     { code: 4, name: 'Alphabetical' }
                ];
            }
        };

        return directive;
    }
})();