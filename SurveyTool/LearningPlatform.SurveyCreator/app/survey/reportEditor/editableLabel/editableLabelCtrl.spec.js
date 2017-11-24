(function () {
    'use stric';
    describe('Testing editableLabelCtrl controller', function () {
        var scope, $modal, ctrl;

        beforeEach(function() {
            module('svt');

            inject(function($rootScope, $controller) {
                scope = $rootScope.$new();
                $modal = jasmine.createSpyObj('$modal', ['open']);

                ctrl = $controller('editableLabelCtrl', {
                    $scope: scope,
                    $modal: $modal
                });
            });
        });

        describe('Testing openDialog function', function () {
            it('should open dialog', function () {
                ctrl.openDialog();

                expect($modal.open).toHaveBeenCalled();
            });
        });
    });
})();