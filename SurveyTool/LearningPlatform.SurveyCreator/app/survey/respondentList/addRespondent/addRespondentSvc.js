(function () {
    angular.module('svt').service('addRespondentSvc', addRespondentSvc);
    addRespondentSvc.$inject = ['arrayUtilSvc'];

    function addRespondentSvc(arrayUtilSvc) {
        var service = {
            validateEmailAddresses: validateEmailAddresses
        };

        return service;

        function validateEmailAddresses(emailAddresses) {
            if (!arrayUtilSvc.isArrayHasElement(emailAddresses)) {
                toastr.error('Invalid email addresses');
                return false;
            }

            var invalidEmailAddresses = emailAddresses.filter(function (email) {
                return email.isEmail() === false;
            });

            if (invalidEmailAddresses.length > 0) {
                var errorMessage = 'Invalid email address <strong>(' + invalidEmailAddresses.join(', ') + ')</strong>';
                toastr.error(errorMessage);
                return false;
            }

            return true;
        }

    }
})();