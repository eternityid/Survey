(function () {
    'use strict';

    angular
        .module('svt')
        .directive('image', getFile);

    getFile.$inject = ['surveyDataSvc'];

    function getFile(surveyDataSvc) {
        return {
            restrict: 'A',
            scope: {
                surveyId: '@',
                questionId: '@',
                fileName: '@'
            },
            link: function (scope, element) {
                if (!scope.surveyId || !scope.fileName) return;

                surveyDataSvc.getFile(scope.surveyId, scope.fileName).$promise.then(function (data) {
                    element[0].src = data;
                });
            }
        };
    }
})();