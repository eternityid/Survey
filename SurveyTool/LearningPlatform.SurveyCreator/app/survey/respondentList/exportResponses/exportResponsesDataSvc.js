(function () {
    'use strict';

    angular
        .module('svt')
        .factory('exportResponsesDataSvc', exportResponsesDataSvc);

    exportResponsesDataSvc.$inject = ['$resource', 'host'];

    function exportResponsesDataSvc($resource, host) {
        var dataService = {
            exportResponses: exportResponses
        };

        return dataService;

        function exportResponses(settings, testMode) {
            return $resource(host + '/surveys/:surveyId/responses/export', { surveyId: '@surveyId', testMode: testMode },
                {
                    'export': {
                        method: 'POST',
                        transformResponse: transformResponse
                    }
                })
                .export({ surveyId: settings.surveyId }, JSON.stringify(settings));

            function transformResponse(data, headerGetters) {
                return {
                    data: data,
                    header: headerGetters()
                };
            }
        }
    }
})();