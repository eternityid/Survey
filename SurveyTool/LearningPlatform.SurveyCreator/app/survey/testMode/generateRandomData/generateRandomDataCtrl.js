(function () {
    angular
        .module('svt')
        .controller('generateRandomDataCtrl', generateRandomDataCtrl);

    generateRandomDataCtrl.$inject = ['$scope', 'pushDownSvc', 'generateRandomDataSvc', 'generateRandomResponsesDataSvc', 'errorHandlingSvc', 'spinnerUtilSvc'];

    function generateRandomDataCtrl($scope, pushDownSvc, generateRandomDataSvc, generateRandomResponsesDataSvc, errorHandlingSvc, spinnerUtilSvc) {
        var vm = this;

        init();

        function init() {
            vm.surveyId = $scope.surveyId;
            vm.numberOfTestResponsesOptions = generateRandomDataSvc.getNumberOfTestResponsesOptions();
            vm.numberOfTestResponses = null;

            vm.handleAfterSave = $scope.handleAfterSave;
            vm.generateRandomData = generateRandomData;
            vm.close = closeMe;
            pushDownSvc.setLoadingStatus(true);
        }

        function closeMe() {
            pushDownSvc.hidePushDown();
        }

        function generateRandomData() {
            spinnerUtilSvc.showSpinner();
            generateRandomResponsesDataSvc.generateRandomData(vm.surveyId, vm.numberOfTestResponses).$promise.then(function () {
                vm.handleAfterSave();
                pushDownSvc.hidePushDown();                
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError(error.data || 'Generate random responses was not successful.', error);
            });
        }

    }
})();