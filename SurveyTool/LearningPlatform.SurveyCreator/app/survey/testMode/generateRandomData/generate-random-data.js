(function () {
    'use strict';

    angular
        .module('svt')
        .directive('generateRandomData', generateRandomData);

    function generateRandomData() {
        var directive = {
            restrict: 'E',
            scope: {
                surveyId: '@',
                handleAfterSave: '&'
            },
            templateUrl: 'survey/testMode/generateRandomData/generate-random-data.html',
            controller: 'generateRandomDataCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();