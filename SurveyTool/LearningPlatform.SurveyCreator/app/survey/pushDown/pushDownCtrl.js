(function () {
    angular
        .module('svt')
        .controller('pushDownCtrl', pushDownCtrl);

    pushDownCtrl.$inject = ['$scope', 'pushDownSvc'];

    function pushDownCtrl($scope, pushDownSvc) {
        var vm = this;

        vm.close = closeMe;

        init();

        function init() {
            vm.pushDownSettings = pushDownSvc.getPushDownSettings();

            $scope.$on('$destroy', function () {
                vm.close();
            });
        }

        function closeMe() {
            pushDownSvc.hidePushDown();
            pushDownSvc.setLoadingStatus(false);
        }
    }
})();