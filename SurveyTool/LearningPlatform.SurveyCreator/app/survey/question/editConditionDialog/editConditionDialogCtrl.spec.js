(function () {
    describe('Tetsting editConditionDialogCtrl controller', function () {
        var ctrl, scope, modalInstance, modalData, expressionBuilderSvc;

        beforeEach(function () {
            module('svt');

            inject(function ($rootScope, $controller, $injector) {
                scope = $rootScope.$new();

                modalInstance = jasmine.createSpyObj('modalInstance', [
                    'dismiss', 'close'
                ]);

                modalData = jasmine.createSpyObj('modalData', [
                    'modalTitle', 'question', 'okTitle'
                ]);

                expressionBuilderSvc = jasmine.createSpyObj('expressionBuilderSvc', [
                    'validateExpression'
                ]);

                ctrl = $controller('editConditionDialogCtrl', {
                    $scope: scope,
                    $modalInstance: modalInstance,
                    modalData: modalData,
                    expressionBuilderSvc: expressionBuilderSvc
                });
                scope.$digest();
            });
        });
    });
})();