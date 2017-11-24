(function () {
    angular.module('svt').directive('fontSelector', fontSelector);

    function fontSelector() {
        var directive = {
            restrict: 'E',
            scope: {
                ngModel: '=',
                onFontChange: '&'
            },
            templateUrl: 'survey/common/fontSelector/font-selector.html',
            controller: 'fontSelectorCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();