(function () {
    angular.module('svt').controller('expressionBuilderCtrl', expressionBuilderCtrl);

    expressionBuilderCtrl.$inject = [
        '$scope', 'expressionBuilderSvc', 'expressionBuilderConst', 'expressionOperatorSvc'];

    function expressionBuilderCtrl(
        $scope, expressionBuilderSvc, expressionBuilderConst, expressionOperatorSvc) {
        var minimumOfExpressionItemsInGroup = 2;
        var vm = this;

        vm.expressionLogicalOperators = expressionOperatorSvc.getExpressionLogicalOperators();
        vm.expressionOperators = expressionOperatorSvc.getExpressionOperators();
        vm.getPreviousExpressionItem = getPreviousExpressionItem;

        vm.builder = {
            questions: [],
            logicalOperators: expressionOperatorSvc.getExpressionLogicalOperators(),
            operators: expressionOperatorSvc.getExpressionOperators(),
            addItem: addExpressionItem,
            removeItem: removeExpressionItem,
            addGroupItem: addExpressionItemGroup,
            removeGroupItem: removeExpressionItemGroup
        };

        init();

        function init() {
            if (!$scope.expression) {
                $scope.expression = expressionBuilderSvc.getDefaultExpression();
            }
            vm.expression = $scope.expression;

            expressionBuilderSvc.setExpression(vm.expression);
            expressionBuilderSvc.setupRequiredProperties();

            vm.builder.questions = ($scope.question) ?
                expressionBuilderSvc.getQuestionsForExpression($scope.question) :
                expressionBuilderSvc.getQuestionsForExpressionByPageId($scope.pageId);
            vm.builder.summary = expressionBuilderSvc.getSummaryExpression();
        }

        function addExpressionItem(expressionItemPosition) {
            var defaultExpressionItem = expressionBuilderSvc.getDefaultExpression().expressionItems[1],
                indexOfNewExpressionItem = expressionItemPosition + 1;

            vm.expression.expressionItems.splice(indexOfNewExpressionItem, 0, defaultExpressionItem);
            expressionBuilderSvc.updateExpressionItems(vm.expression.expressionItems);
            updateSharedExpression();
        }

        function removeExpressionItem(expressionItemPosition) {
            var indexOfPreviousExpressionItem = expressionItemPosition - 1,
                previousExpressionItem = vm.expression.expressionItems[indexOfPreviousExpressionItem];

            if (previousExpressionItem && previousExpressionItem.indent === 0) {
                var expressionItemGroupInfo = expressionBuilderSvc.getExpressionItemGroupInfo(
                    vm.expression.expressionItems, previousExpressionItem.position);
                if (expressionItemGroupInfo.numOfItemsInGroup <= minimumOfExpressionItemsInGroup) {
                    removeItems(previousExpressionItem.position, expressionItemGroupInfo.numOfItemsInGroup);
                    $scope.$emit('event:DetectSkipCommandEditorError');
                    return;
                }
            }

            removeItems(expressionItemPosition, 1);
            $scope.$emit('event:DetectSkipCommandEditorError');
            return;

            function removeItems(position, numberOfItem) {
                vm.expression.expressionItems.splice(position, numberOfItem);
                expressionBuilderSvc.updateExpressionItems(vm.expression.expressionItems);
                updateSharedExpression();
            }
        }

        function addExpressionItemGroup(expressionItemGroupPosition) {
            var expressionItemGroupInfo = expressionBuilderSvc.getExpressionItemGroupInfo(
                vm.expression.expressionItems, expressionItemGroupPosition),
                defaultExpression = expressionBuilderSvc.getDefaultExpression(),
                indexOfNewExpressionItemGroup = expressionItemGroupInfo.lastItemPosition + 1;

            var defaultExpressionItemGroup = defaultExpression.expressionItems[0],
                defaultExpressionItem = defaultExpression.expressionItems[1];

            vm.expression.expressionItems.splice(
                indexOfNewExpressionItemGroup, 0, defaultExpressionItemGroup, defaultExpressionItem);

            expressionBuilderSvc.updateExpressionItems(vm.expression.expressionItems);
            updateSharedExpression();
        }

        function updateSharedExpression() {
            vm.builder.summary = expressionBuilderSvc.getSummaryExpression();
        }

        function removeExpressionItemGroup(expressionItemGroupPosition) {
            if (vm.expression.expressionItems.length <= minimumOfExpressionItemsInGroup) return;

            var expressionItemGroupInfo = expressionBuilderSvc.getExpressionItemGroupInfo(
                vm.expression.expressionItems, expressionItemGroupPosition);
            vm.expression.expressionItems.splice(expressionItemGroupPosition, expressionItemGroupInfo.numOfItemsInGroup);

            expressionBuilderSvc.updateExpressionItems(vm.expression.expressionItems);
            updateSharedExpression();

            $scope.$emit('event:DetectSkipCommandEditorError');
        }

        function getPreviousExpressionItem(expressionItemPosition) {
            return expressionBuilderSvc.getPreviousExpressionItem(vm.expression.expressionItems, expressionItemPosition);
        }
    }
})();