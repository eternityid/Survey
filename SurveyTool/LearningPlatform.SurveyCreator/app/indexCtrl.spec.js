(function () {
    'use strict';
    describe('Testing indexCtrl controller', function () {
        var indexCtrl, callback, callback1,
            route, location,
            authSvc, rootScope,
            q,
            modalStack,
            userSvc,
            spinnerUtilSvc,
            userDataSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($injector, $controller, $q) {
                q = $q;
                location = $injector.get('$location');
                authSvc = jasmine.createSpyObj('authSvc', ['getLoginData', 'logout', 'ensureLogin']);
                route = jasmine.createSpyObj('$route', ['reload']);

                callback = jasmine.createSpy();
                callback1 = jasmine.createSpy();
                rootScope = $injector.get('$rootScope');
                spyOn(rootScope, '$broadcast');
                spyOn(rootScope, '$on').and.callFake(function (param) {
                    if (param === 'loggedIn') { return function () { callback(); }; }
                    else if (param === '$routeChangeStart') {
                        return function () { callback1(); };
                    }
                    return null;
                });

                modalStack = jasmine.createSpyObj('$modalStack', ['getTop']);

                userSvc = jasmine.createSpyObj('userSvc', ['isAdmin']);
                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);
                userDataSvc = jasmine.createSpyObj('userDataSvc', ['upsertUserByLogginIn']);
                userDataSvc.upsertUserByLogginIn.and.returnValue({ $promise: $q.when({}) });

                indexCtrl = $controller('indexCtrl', {
                    $location: location,
                    authSvc: authSvc,
                    $route: route,
                    $rootScope: rootScope,
                    $modalStack: modalStack,
                    userSvc: userSvc,
                    spinnerUtilSvc: spinnerUtilSvc,
                    userDataSvc: userDataSvc
                });
            });
        });

        describe('Testing init function', function () {
            it('should call init function with valid data', function () {
                authSvc.getLoginData.and.returnValue({ userName: 'dummy', userRole: 'Admin' });
                userSvc.isAdmin.and.returnValue(true);
                indexCtrl.init();

                expect(indexCtrl.userLoggedIn.userName).toEqual('dummy');
                expect(indexCtrl.userLoggedIn.isAdmin).toBeTruthy();
                expect(indexCtrl.userLoggedIn.isAuthenticated).toBeTruthy();
                expect(rootScope.$on).toHaveBeenCalled();
            });
        });

        describe('Testing logout function', function () {
            it('should call logout function', function () {
                indexCtrl.logout();
                expect(authSvc.logout).toHaveBeenCalled();
            });
        });
    });
})();