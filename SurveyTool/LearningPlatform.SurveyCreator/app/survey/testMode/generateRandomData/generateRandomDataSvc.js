(function () {
    'use strict';

    angular
        .module('svt')
        .factory('generateRandomDataSvc', generateRandomDataSvc);

    function generateRandomDataSvc() {
        var service = {
            getNumberOfTestResponsesOptions: getNumberOfTestResponsesOptions,
            validate: validate
        };

        return service;

        function getNumberOfTestResponsesOptions() {
            return [10, 50, 100, 500, 1000];
        }

        function validate(numberOfTestResponses) {
            if (!numberOfTestResponses) {
                toastr.error('Please choose number of test respondents');
            }
        }
    }
})();