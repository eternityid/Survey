(function () {
    'use strict';

    angular
        .module('svt')
        .directive('testModeButton', testModeButton);

    function testModeButton() {
        var directive = {
            restrict: 'E',
            scope: {
                testModeSettings: '=',
                isDefault: '='
            },
            templateUrl: 'survey/testMode/testModeButton/test-mode-button.html',
            controller: 'testModeButtonCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();