(function () {
    'use strict';

    angular
        .module('svt')
        .directive('pushDown', pushDown);

    function pushDown() {
        var directive = {
            restrict: 'E',
            transclude: true,
            templateUrl: 'survey/pushDown/push-down.html',
            controller: 'pushDownCtrl',
            controllerAs: 'pushDownCtrl'
        };

        return directive;
    }
})();