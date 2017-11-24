(function () {
    'use stric';
    describe('Testing pushDownCtrl controller', function () {
        var scope, ctrl, pushDownSvc;

        beforeEach(function () {
            module('svt');

            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();

                pushDownSvc = jasmine.createSpyObj('pushDownSvc', [
                    'hidePushDown', 'getPushDownSettings', 'setLoadingStatus'
                ]);

                ctrl = $controller('pushDownCtrl', {
                    $scope: scope,
                    pushDownSvc: pushDownSvc
                });
            });
        });

        describe('Testing closeMe function', function () {
            it('should hide push down', function () {
                ctrl.close();

                expect(pushDownSvc.hidePushDown).toHaveBeenCalled();
            });
        });
    });
})();