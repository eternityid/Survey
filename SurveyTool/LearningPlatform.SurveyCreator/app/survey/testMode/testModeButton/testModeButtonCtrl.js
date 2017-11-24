(function () {
    angular
        .module('svt')
        .controller('testModeButtonCtrl', testModeButtonCtrl);

    testModeButtonCtrl.$inject = ['$scope', 'testModeSvc'];

    function testModeButtonCtrl($scope, testModeSvc) {
        var vm = this;

        vm.testModeSettings = $scope.testModeSettings;

        vm.toggleTestMode = toggleTestMode;

        function toggleTestMode() {
            testModeSvc.toggleTestMode(vm.testModeSettings.surveyId);
        }

    }
})();