(function() {
    'use stric';
    describe('Testing deleteDialogCtrl controller', function() {
        var deleteDialogCtrl, scope, modalInstance, modalData;

        beforeEach(function() {
            module('svt');
            inject(function($rootScope, $controller) {
                scope = $rootScope.$new();
                modalInstance = jasmine.createSpyObj('modalInstance', ['close']);
                modalData = {
                    message: 'dummy'
                };

                deleteDialogCtrl = $controller('deleteDialogCtrl', {
                    $scope: scope,
                    $modalInstance: modalInstance,
                    modalData: modalData
                });
            });
        });

        describe('Testing close function', function() {
            it('should close the result', function() {
                var result = true;
                scope.deleteItem(result);

                expect(modalInstance.close).toHaveBeenCalledWith({ status: true });
            });
        });
    });
})();