(function () {
    'use strict';

    angular
        .module('svt')
        .factory('userDataSvc', userDataSvc);

    userDataSvc.$inject = [
        '$resource', 'host'
    ];

    function userDataSvc($resource, host) {
        var services = {
            getAllUsers: getAllUsers,
            upsertUserCompany: upsertUserCompany,
            upsertUser: upsertUser,
            upsertUserByLogginIn: upsertUserByLogginIn
        };
        return services;

        function getAllUsers() {
            return $resource(host + '/users', {}, { 'getAllUsers': { method: 'GET', isArray: true } }).getAllUsers({});
        }

        function upsertUserCompany(user) {
            return $resource(host + '/users/:externalId/company', { externalId: '@externalId' }, { 'upsertUserCompany': { method: 'PUT' } })
                .upsertUserCompany({ externalId: user.externalId }, JSON.stringify(user));
        }

        function upsertUser(user) {
            return $resource(host + '/users/:externalId', { externalId: '@externalId' }, { 'upsertUser': { method: 'PUT' } })
                .upsertUser({ externalId: user.externalId }, JSON.stringify(user));
        }

        function upsertUserByLogginIn() {
            return $resource(host + '/user', {}, { 'upsertUserByLogginIn': { method: 'PUT' } })
                .upsertUserByLogginIn({});
        }
    }
})();