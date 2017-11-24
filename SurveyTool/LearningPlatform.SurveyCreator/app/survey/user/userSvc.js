(function () {
    angular.module('svt').service('userSvc', UserSvc);

    function UserSvc() {
        var service = {
            isAdmin: isAdmin,
            getFullName: getFullName
        };
        return service;

        function isAdmin(userRole) {
            if (typeof userRole === 'string' && userRole.toLowerCase() === 'admin') return true;
            if (Array.isArray(userRole)) {
                return userRole.some(function (role) {
                    return role.toLowerCase() === 'admin';
                });
            }
            return false;
        }

        function getFullName(firstName, lastName) {
            var nameParts = [];
            if (firstName) nameParts.push(firstName);
            if (lastName) nameParts.push(lastName);
            return nameParts.join(' ');
        }
    }
})();