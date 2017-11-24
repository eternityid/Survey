(function() {
    angular.module('svt').factory('errorHandlingSvc', ErrorHandlingSvc);

    function ErrorHandlingSvc() {
        var service = {
            manifestError: manifestError,
            writeErrorToConsole: writeErrorToConsole
        };
        return service;

        function manifestError(message, error) {
            toastr.error(message);
            throw { message: message, error: error };
        }

        function writeErrorToConsole(message, error) {
            throw { message: message, error: error };
        }
    }
})();