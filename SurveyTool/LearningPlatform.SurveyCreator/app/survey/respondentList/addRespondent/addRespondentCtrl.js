(function () {
    angular
        .module('svt')
        .controller('addRespondentCtrl', addRespondentCtrl);

    addRespondentCtrl.$inject = ['$scope', 'pushDownSvc', 'spinnerUtilSvc', 'errorHandlingSvc', 'testModeSvc',
    'addRespondentSvc', 'respondentListDataSvc'];

    function addRespondentCtrl($scope, pushDownSvc, spinnerUtilSvc, errorHandlingSvc, testModeSvc,
        addRespondentSvc, respondentListDataSvc) {
        var vm = this;

        vm.emailAddressesContainer = angular.element(document.querySelector('#email-addresses .ui-select-container'));
        vm.emailAddressesSearchContainer = angular.element(document.querySelector('#email-addresses .ui-select-container .ui-select-search'));
        vm.surveyId = $scope.surveyId;
        vm.emailAddresses = [];
        vm.availableEmailAddresses = [];

        vm.close = closeMe;
        vm.addRespondents = addRespondents;
        vm.init = init;

        init();

        function init() {
            vm.testModeSettings = testModeSvc.getTestModeSettings(vm.surveyId);
            pushDownSvc.setLoadingStatus(true);
        }

        function closeMe() {
            pushDownSvc.hidePushDown();
        }

        function addRespondents() {
            if (!addRespondentSvc.validateEmailAddresses(vm.emailAddresses)) {
                $scope.highlightEmailAddressesContainer(vm.emailAddressesContainer, vm.emailAddressesSearchContainer);
                return;
            }
            var message = {
                fail: 'Adding respondents was not successful.'
            };

            spinnerUtilSvc.showSpinner();
            respondentListDataSvc.addRespondents(vm.surveyId, vm.emailAddresses, vm.testModeSettings.isActive).$promise.then(function () {
                spinnerUtilSvc.hideSpinner();

                $scope.handleAfterSave();
                vm.close();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError(message.fail, error);
            });
        }
    }
})();