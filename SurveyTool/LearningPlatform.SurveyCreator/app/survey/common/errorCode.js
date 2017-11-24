(function () {
    angular.module('svt')
        .constant('errorCode', {
            RequestCanceller: 0,
            Unauthorized: 401,
            Forbidden: 403,
            RequestTimeout: 408,
            LoginTimeout: 440,
            GatewayTimeout: 504,
            NetworkConnectTimeout: 599
        });
})();