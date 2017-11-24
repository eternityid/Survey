(function () {
    describe('Testing expressionBuilderCtrl controller', function () {
        var ctrl, $scope, expressionBuilderSvc, expressionOperatorSvc;

        beforeEach(function() {
            module('svt');
            inject(function($rootScope, $controller) {
                $scope = $rootScope.$new();
                $scope.expression = {};

                expressionBuilderSvc = jasmine.createSpyObj('expressionBuilderSvc', [
                    'setupRequiredProperties',
                    'getDefaultExpression', 'setExpression', 'getQuestionsForExpressionByPageId',
                    'getSummaryExpression', 'getExpressionItemGroupInfo', 'updateExpressionItems'
                ]);
                expressionBuilderSvc.getDefaultExpression.and.returnValue({});
                expressionBuilderSvc.getQuestionsForExpressionByPageId.and.returnValue([]);
                expressionBuilderSvc.getSummaryExpression.and.returnValue({});

                expressionOperatorSvc = jasmine.createSpyObj('expressionOperatorSvc', [
                    'getExpressionLogicalOperators', 'getExpressionOperators']);
                expressionOperatorSvc.getExpressionLogicalOperators.and.returnValue([]);
                expressionOperatorSvc.getExpressionOperators.and.returnValue({});

                ctrl = $controller('expressionBuilderCtrl', {
                    $scope: $scope,
                    expressionBuilderSvc: expressionBuilderSvc,
                    expressionOperatorSvc: expressionOperatorSvc
                });
            });
        });

        describe('Testing removeExpressionItem function', function() {
            var expressionItemPosition, itemsCount;
            beforeEach(function() {
                ctrl.expression.expressionItems = [{ indent: 0 }, {}, {}, {}, {}];
            });

            describe('Delete level 1 item', function () {
                beforeEach(function() {
                    expressionItemPosition = 1;
                    itemsCount = ctrl.expression.expressionItems.length;
                });

                it('should remove all items in parent group', function() {
                    expressionBuilderSvc.getExpressionItemGroupInfo.and.returnValue({ numOfItemsInGroup: 2 });

                    ctrl.builder.removeItem(expressionItemPosition);

                    expect(ctrl.expression.expressionItems.length).toEqual(itemsCount - 2);
                });

                it('should not remove all items in parent group', function() {
                    expressionBuilderSvc.getExpressionItemGroupInfo.and.returnValue({ numOfItemsInGroup: 3 });

                    ctrl.builder.removeItem(expressionItemPosition);

                    expect(ctrl.expression.expressionItems.length).toEqual(itemsCount - 1);
                });
            });

            it('should remove first item', function() {
                expressionItemPosition = 0;

                ctrl.builder.removeItem(expressionItemPosition);

                expect(ctrl.expression.expressionItems.length).toEqual(itemsCount - 1);
            });
        });

        describe('Testing removeExpressionItemGroup function', function () {
            var expressionItemGroupPosition = 1;

            it('should not remove item group', function() {
                ctrl.expression.expressionItems = [];

                ctrl.builder.removeGroupItem(expressionItemGroupPosition);

                expect(expressionBuilderSvc.getExpressionItemGroupInfo).not.toHaveBeenCalled();
                expect(expressionBuilderSvc.updateExpressionItems).not.toHaveBeenCalled();
            });

            it('should remove item group', function () {
                ctrl.expression.expressionItems = [{}, {}, {}];
                var itemsCount = ctrl.expression.expressionItems.length;
                expressionBuilderSvc.getExpressionItemGroupInfo.and.returnValue({ numOfItemsInGroup: 1 });

                ctrl.builder.removeGroupItem(expressionItemGroupPosition);

                expect(ctrl.expression.expressionItems.length).toBeLessThan(itemsCount);
            });
        });
    });
})();