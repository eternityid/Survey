(function () {
    'use strict';

    angular
        .module('svt')
        .controller('welcomeCtrl', WelcomeCtrl);

    WelcomeCtrl.$inject = [
        '$scope', '$location'
    ];

    function WelcomeCtrl($scope, $location) {
        $scope.goToHomePage = function () {
            $location.path('/').replace();
        };
    }
})();