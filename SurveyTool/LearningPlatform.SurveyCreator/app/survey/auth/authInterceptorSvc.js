(function () {
    'use strict';

    angular.module('svt').factory('authInterceptorSvc', authInterceptorSvc);

    authInterceptorSvc.$inject = ['$q', '$injector', 'authSvc', '$rootScope', 'errorCode', '$location'];

    function authInterceptorSvc($q, $injector, authSvc, $rootScope, errorCode, $location) {
        var service = {
            request: request,
            responseError: responseError
        };
        return service;

        function request(config) {
            config.headers = config.headers || {};
            var authData = authSvc.getLoginData();
            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.token;
            }
            return config;
        }

        function responseError(rejection) {
            if (rejection.status === errorCode.Unauthorized) {
                authSvc.redirectForToken();
            } else if (rejection.status === errorCode.Forbidden) {
                $location.path('/').replace();
            }
            return $q.reject(rejection);
        }
    }

})();