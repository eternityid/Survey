(function() {
    'use strict';

    angular
        .module('svt')
        .factory('accessRightsDataSvc', accessRightsDataSvc);

    accessRightsDataSvc.$inject = ['$resource', 'host'];

    function accessRightsDataSvc($resource, host) {
        var dataService = {
            getUsersByCompany: getUsersByCompany,
            updateAccessRights: updateAccessRights
        };
        return dataService;

        function getUsersByCompany() {
            var params = {
                method: 'GET', isArray: true
            };

            return $resource(host + '/user/co-workers', {}, { 'getUsersByCompany': params })
                .getUsersByCompany({});
        }

        function updateAccessRights(surveyId, accessRights) {
            return $resource(host + '/surveys/:surveyId/access-rights',
                { surveyId: '@surveyId' },
                { 'updateAccessRights': { method: 'PUT' } })
              .updateAccessRights({ surveyId: surveyId }, JSON.stringify(accessRights));
        }
    }
})();