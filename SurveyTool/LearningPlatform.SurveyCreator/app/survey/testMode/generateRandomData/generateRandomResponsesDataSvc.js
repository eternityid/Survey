(function () {
    'use strict';

    angular
        .module('svt')
        .factory('generateRandomResponsesDataSvc', generateRandomResponsesDataSvc);

    generateRandomResponsesDataSvc.$inject = ['$resource', 'host'];

    function generateRandomResponsesDataSvc($resource, host) {
        var service = {
            generateRandomData: generateRandomData
        };

        return service;

        function generateRandomData(surveyId, numberOfTestReponses) {
            return $resource(host + '/surveys/:surveyId/responses/generate', { surveyId: '@surveyId', iterations: numberOfTestReponses }, { 'generate': { method: 'POST' } })
                        .generate({ surveyId: surveyId });
        }
    }
})();