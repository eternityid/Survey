(function () {
    angular.module('svt').service('createUserSvc', createUserSvc);

    function createUserSvc() {
        var service = {
            emptyChecking: emptyChecking,
            policyAccountChecking: policyAccountChecking
        };
        return service;

        function emptyChecking(items, messages, placeHolder) {
            var returnValue = false;
            for (var i = 0; i < items.length; i++) {
                if (!items[i] || String(items[i]).trim() === "") {
                    placeHolder[i].value = messages[i] + ' is required.';
                    placeHolder[i].valid = false;
                    returnValue = true;
                } else {
                    placeHolder[i].value = messages[i];
                    placeHolder[i].valid = true;
                }
            }
            return returnValue;
        }

        function policyAccountChecking(userRequest) {
            if (userRequest.password && userRequest.password.length < 6) {
                toastr.warning("The password must be 6 characters at least!");
                return true;
            }

            var regExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            if (!regExp.test(userRequest.emailAddress)) {
                toastr.warning("The email address is invalid!");
                return true;
            }

            return false;
        }
    }
})();