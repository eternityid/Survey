(function () {
    'use strict';

    angular
        .module('svt')
        .factory('changePasswordDataSvc', ChangePasswordDataSvc);

    ChangePasswordDataSvc.$inject = ['$resource', 'adminUserApiUrl'];

    function ChangePasswordDataSvc($resource, adminUserApiUrl) {
        var service = {
            changePassword: changePassword
        };

        return service;

        function changePassword(changePasswordModel) {
            return $resource(adminUserApiUrl + '/management/users/changepassword', {}, { 'changePassword': { method: 'PUT' } })
                .changePassword({}, JSON.stringify(changePasswordModel));
        }
    }
})();