(function() {
    angular.module('svt').controller('conditionallyDisplayCtrl', conditionallyDisplayCtrl);
    conditionallyDisplayCtrl.$inject = ['$scope', 'arrayUtilSvc', 'skipCommandSvc'];

    function conditionallyDisplayCtrl($scope, arrayUtilSvc, skipCommandSvc) {
        var vm = this;
        vm.init = init;

        init();

        function init() {
            vm.displayedExpressionItems = [];
            setupExpressionChanged();
            return;

            function setupExpressionChanged() {
                $scope.$watch('question.questionMaskExpression', function (expression) {
                    vm.displayedExpressionItems = [];
                    if (expression && arrayUtilSvc.isArrayHasElement(expression.expressionItems)) {
                        vm.displayedExpressionItems = skipCommandSvc.getDisplayedExpressionItems(
                            expression.expressionItems, $scope.question.pageId);
                    }
                }, true);
            }
        }
    }
})();