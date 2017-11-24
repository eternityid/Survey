(function () {
    describe('Testing conditionallyDisplayCtrl controller', function () {
        var ctrl, scope, arrayUtilSvc, skipCommandSvc;

        beforeEach(function () {
            module('svt');

            inject(function ($rootScope, $controller, $injector) {
                scope = $rootScope.$new();
                scope.question = {};

                arrayUtilSvc = $injector.get('arrayUtilSvc');

                skipCommandSvc = jasmine.createSpyObj('skipCommandSvc', [
                  'getDisplayedExpressionItems'
                ]);

                ctrl = $controller('conditionallyDisplayCtrl', {
                    $scope: scope,
                    arrayUtilSvc: arrayUtilSvc,
                    skipCommandSvc: skipCommandSvc
                });
                scope.$digest();
            });
        });

        describe('Testing setupExpressionChanged function', function () {
            var count;

            beforeEach(function () {
                count = skipCommandSvc.getDisplayedExpressionItems.calls.count();
            });

            it('should setup displayed expression when expression has items', function () {
                scope.question.questionMaskExpression = {
                    expressionItems: [{}]
                };

                scope.$digest();

                expect(skipCommandSvc.getDisplayedExpressionItems.calls.count()).toEqual(count + 1);
            });

            it('should not setup displayed expression when expression does not have items', function () {
                scope.question.questionMaskExpression = null;

                scope.$digest();

                expect(skipCommandSvc.getDisplayedExpressionItems.calls.count()).toEqual(count);
            });
        });
    });
})();