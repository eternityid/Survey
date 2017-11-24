(function () {
    angular
        .module('svt')
        .directive('selectionOption', selectionOption);

    function selectionOption() {
        var directive = {
            require: '^^selectionOptionList',
            restrict: 'E',
            scope: {
                option: '=',
                openningOption: '=',
                originalQuestionType: '=',
                question: '=',
                optionList: '=',
                options:'=',
                onKeyDownOnOptionAliasField: '&',
                onOptionTitleChange: '&'
            },
            templateUrl: 'survey/question/types/selection/selection-option.html',
            controller: 'selectionOptionCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();