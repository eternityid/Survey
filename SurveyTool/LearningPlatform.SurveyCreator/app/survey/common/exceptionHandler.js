(function() {
    angular.module('svt').config(exceptionConfig);
    exceptionConfig.$inject = ['$provide'];

    function exceptionConfig($provide) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    extendExceptionHandler.$inject = ['$log'];

    function extendExceptionHandler($log) {
        return function(exception, cause) {
            if (exception === null || typeof exception !== 'object') return;
            exception.message = cause ? exception.message + ' Caused by: ' + cause : exception.message;
            $log.debug(exception);
        };
    }
})();