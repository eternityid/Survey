(function () {
    'use strict';

    angular
        .module('svt')
        .factory('companyDataSvc', companyDataSvc);

    companyDataSvc.$inject = [
        '$resource', 'host'
    ];

    function companyDataSvc($resource, host) {
        var services = {
            getAllCompanies: getAllCompanies
        };
        return services;

        function getAllCompanies() {
            return $resource(host + '/companies', {}, { 'getAllCompanies': { method: 'GET', isArray: true } }).getAllCompanies({});
        }
    }
})();