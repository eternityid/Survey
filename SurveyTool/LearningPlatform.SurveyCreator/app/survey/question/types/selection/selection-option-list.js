(function () {
    'use strict';

    angular
        .module('svt')
        .directive('selectionOptionList', selectionOptionList);

    function selectionOptionList() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '=',
                previewQuestion: '=',
                optionList: '=',
                openningOption: '=',
                displayLogic: '=',
                onOptionTitleChange: '&',
                onOptionGroupHeaderChange: '&'
            },
            templateUrl: 'survey/question/types/selection/selection-option-list.html',
            controller: 'selectionOptionListCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();