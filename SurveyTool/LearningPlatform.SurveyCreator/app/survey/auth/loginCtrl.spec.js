(function () {
    'use strict';
    //TODO: This needs to be updated to reflect the changes to loginCtrl.
    describe('Testing loginCtrl controller', function () {
        var loginCtrl, $routeParams = { response: 'dummy' }, $location, route, authSvc;

        beforeEach(function () {
            module('svt');

            inject(function ($controller) {
                authSvc = jasmine.createSpyObj('authSvc', ['getLoginData', 'processTokenCallback']);
                authSvc.getLoginData.and.returnValue(1);

                $location = {
                    path: function() {
                        return true;
                    }
                };

                route = { reload: function () { return true; } };

                loginCtrl = $controller('loginCtrl', {
                    $routeParams: $routeParams,
                    $location: $location,
                    $route: route,
                    authSvc: authSvc
                });
            });
        });

        describe('Testing init function', function () {
            it('should show Layout of Login', function () {
                expect(authSvc.getLoginData).toHaveBeenCalled();
            });
        });
    });
})();