(function () {
    'use strict';

    angular
        .module('svt')
        .directive('svtLaunch', SvtLaunch);

    function SvtLaunch() {
        var directive = {
            restrict: 'E',
            templateUrl: 'survey/launch/launch.html',
            controller: 'launchCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();