(function () {
    'use strict';

    angular
        .module('svt')
        .factory('userManagementDataSvc', userManagementDataSvc);

    userManagementDataSvc.$inject = ['$resource', 'adminUserApiUrl'];

    function userManagementDataSvc($resource, adminUserApiUrl) {
        var dataService = {
            getAllUsers: getAllUsers,
            createUser: createUser,
            editUser: editUser,
            deleteUsers: deleteUsers,
            activateUsers: activateUsers
        };
        return dataService;

        function getAllUsers() {
            return $resource(adminUserApiUrl + '/management/users', {}, { 'getAllUser': { method: 'GET', isArray: true } })
                .getAllUser({});
        }

        function activateUsers(userIds) {
            return $resource(adminUserApiUrl + '/management/users/activate', {}, { 'activateUsers': { method: 'POST' } })
                .activateUsers({}, JSON.stringify(userIds));
        }

        function createUser(user) {
            return $resource(adminUserApiUrl + '/management/users', {}, { 'createUser': { method: 'POST' } })
                .createUser({}, JSON.stringify(user));
        }

        function editUser(userId, user) {
            return $resource(adminUserApiUrl + '/management/users/:userId', { userId: '@userId' }, { 'UpdateUser': { method: 'PUT' } })
                .UpdateUser({ userId: userId }, JSON.stringify(user));
        }

        function deleteUsers(userIds) {
            return $resource(adminUserApiUrl + '/management/users/delete', {}, { 'deleteUsers': { method: 'POST' } })
                .deleteUsers({}, JSON.stringify(userIds));
        }
}
})();