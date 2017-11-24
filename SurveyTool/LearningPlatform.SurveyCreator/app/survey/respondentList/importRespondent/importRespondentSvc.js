(function() {
    angular.module('svt').service('importRespondentSvc', importRespondentSvc);

    function importRespondentSvc() {
        var service = {
            validateRespondentFile: validateRespondentFile
        };
        return service;

        function validateRespondentFile(file) {
            if (file === null) {
                toastr.warning('Please choose a file.');
                return false;
            }
            return true;
        }

    }
})();