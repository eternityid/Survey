(function () {
    angular
        .module('svt')
        .controller('skipCommandCtrl', skipCommandCtrl);

    skipCommandCtrl.$inject = [
        '$scope', 'expressionBuilderSvc', 'skipCommandSvc', 'surveyContentValidation'
    ];

    function skipCommandCtrl(
        $scope, expressionBuilderSvc, skipCommandSvc, surveyContentValidation) {
        var vm = this;

        vm.skipCommand = $scope.skipCommand;

        vm.init = init;

        vm.init();

        function init() {
            vm.isSkipToError = false;
            updateSkipToQuestionTitle();
            onChangeSkipCommand();
            return;

            function updateSkipToQuestionTitle() {
                var skipToError = surveyContentValidation.getSkipToErrorBySkipClientId($scope.skipCommand.clientId);
                if (skipToError) {
                    vm.skipQuestionTitle = skipToError.message;
                    vm.isSkipToError = true;
                } else {
                    var skipToQuestion = expressionBuilderSvc.getQuestionById($scope.skipCommand.skipToQuestionId);
                    vm.skipQuestionTitle = skipToQuestion ? skipToQuestion.title.items[0].text : '';
                }
            }

            function onChangeSkipCommand() {
                $scope.$watch('vm.skipCommand.lastDataChanged', function () {
                    var expressionItems = vm.skipCommand && vm.skipCommand.expression && vm.skipCommand.expression.expressionItems;
                    vm.expressionMessages = skipCommandSvc.getDisplayedExpressionItems(expressionItems, $scope.pageId);
                    updateSkipToQuestionTitle();
                });
            }
        }
    }
})();
