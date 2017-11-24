(function () {
    'use strict';

    angular.module('svt').controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$routeParams', '$location', '$route', 'authSvc'];

    function loginCtrl($routeParams, $location, $route, authSvc) {
        init();

        function init() {
            processTokenCallback();
            if (authSvc.getLoginData()) {
                $location.path('/');
                $route.reload();
            }
        }

        function processTokenCallback() {
            var hash = $routeParams.response;
            if (hash.charAt(0) === "&") {
                hash = hash.substr(1);
            }
            authSvc.processTokenCallback(hash);
        }
    }
})();