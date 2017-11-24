(function () {
    'use strict';

    angular
        .module('svt')
        .directive('skipCommand', skipCommand);

    function skipCommand() {
        var directive = {
            restrict: 'E',
            scope: {
                skipCommand: '=',
                expanded: '='
            },
            templateUrl: 'survey/skipCommand/skip-command.html',
            controller: 'skipCommandCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();