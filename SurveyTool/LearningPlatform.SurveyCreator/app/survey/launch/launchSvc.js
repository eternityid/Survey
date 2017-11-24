(function () {
    angular.module('svt').service('launchSvc', launchSvc);
    launchSvc.$inject = ['arrayUtilSvc'];

    function launchSvc(arrayUtilSvc) {
        'use strict';

        return {
            validateEmail: validateEmail
        };

        function validateEmail(respondent, callback) {
            if (!arrayUtilSvc.isArrayHasElement(respondent.emailTo)) {
                toastr.warning('Invalid email addresses.');
                callback(true);
                return false;
            }

            var invalidEmailAddresses = respondent.emailTo.filter(function(value) {
                return value.isEmail() === false;
            });

            if (invalidEmailAddresses.length >0) {
                var errorMessage = 'Invalid email address <strong>(' + invalidEmailAddresses.join(', ') + ')</strong>';
                toastr.warning(errorMessage);
                callback(true);
                return false;
            }

            callback(false);
            if (respondent.subject === '' || respondent.subject.trim() === '') {
                toastr.warning('Please enter subject.');
                return false;
            }
            if (respondent.body === '' || respondent.body.trim() === '') {
                toastr.warning('Please enter content.');
                return false;
            }
            return true;
        }
    }
})();