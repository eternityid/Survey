(function () {
    'use strict';

    angular
        .module('svt')
        .factory('surveyDashboardDataSvc', surveyDashboardDataSvc);

    surveyDashboardDataSvc.$inject = ['$resource', 'host'];

    function surveyDashboardDataSvc($resource, host) {
        return {
            getDashboardData: getDashboardData
        };

        function getDashboardData(surveyId, testMode) {
            return $resource(host + '/surveys/:surveyId/dashboard', { surveyId: '@surveyId', testMode: testMode }, {
                'getData': {
                    method: 'GET'
                }
            })
            .getData({ surveyId: surveyId });
        }
    }

})();