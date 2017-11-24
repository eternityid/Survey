(function () {
    angular.module('svt').directive('conditionallyDisplay', conditionallyDisplay);

    function conditionallyDisplay() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '=',
                clickToEdit: '&'
            },
            templateUrl: 'survey/question/conditionallyDisplay/conditionally-display.html',
            controller: 'conditionallyDisplayCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();