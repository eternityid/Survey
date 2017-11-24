(function () {
    describe('Testing authInterceptorSvc service', function () {
        var authInterceptorSvc,
            authSvc,
            rootScope,
            errorCode;

        beforeEach(function () {
            module('svt');

            module(function ($provide) {
                authSvc = jasmine.createSpyObj('authSvc', [
                    'getLoginData', 'logout', 'redirectForToken'
                ]);

                $provide.value('authSvc', authSvc);
            });

            inject(function ($injector, $rootScope) {
                errorCode = $injector.get('errorCode');
                $rootScope.digest = jasmine.createSpy();
                rootScope = $rootScope;
                authInterceptorSvc = $injector.get('authInterceptorSvc');
            });
        });

        describe('Testing request function', function () {
            var config,
                result;

            it('should change config header with logged in usser', inject(function () {
                config = {
                    headers: { Authorization: undefined }
                };
                authSvc.getLoginData.and.returnValue({ token: 'dummy' });

                result = authInterceptorSvc.request(config);

                expect(result.headers.Authorization).toBeDefined();
            }));

            it('should not change config header with not logged in usser', inject(function () {
                config = {
                    headers: {}
                };
                authSvc.getLoginData.and.returnValue(null);

                result = authInterceptorSvc.request(config);

                expect(result.headers.Authorization).not.toBeDefined();
            }));
        });

        describe('Testing responseError function', function () {
            var rejection;

            it('should logout with unauthorized user', function () {
                rejection = { status: errorCode.Unauthorized };

                authInterceptorSvc.responseError(rejection);

                expect(authSvc.redirectForToken).toHaveBeenCalled();
            });
        });
    });
})();