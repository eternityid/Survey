(function () {
    'use strict';

    angular
        .module('svt')
        .directive('resultSettings', resultSettings);

    function resultSettings() {
        var directive = {
            restrict: 'E',
            scope: {
                surveyId: '=',
                data: '='
            },
            templateUrl: 'survey/result/resultSettings/result-settings.html',
            controller: 'resultSettingsCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();