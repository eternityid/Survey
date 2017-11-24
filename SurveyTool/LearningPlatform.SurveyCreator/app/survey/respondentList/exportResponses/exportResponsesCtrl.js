(function () {
    angular
        .module('svt')
        .controller('exportResponsesCtrl', exportResponsesCtrl);

    exportResponsesCtrl.$inject = ['$scope', 'pushDownSvc', 'exportResponsesSvc', 'exportResponsesDataSvc', 'spinnerUtilSvc', 'errorHandlingSvc',
    'testModeSvc'];

    function exportResponsesCtrl($scope, pushDownSvc, exportResponsesSvc, exportResponsesDataSvc, spinnerUtilSvc, errorHandlingSvc,
        testModeSvc) {
        var vm = this;

        vm.surveyId = $scope.surveyId;
        vm.model = {
            surveyId: vm.surveyId
        };

        vm.close = closeMe;
        vm.exportResponses = exportResponses;
        vm.init = init;

        init();

        function init() {
            vm.testModeSettings = testModeSvc.getTestModeSettings(vm.surveyId);

            vm.model.titleModes = exportResponsesSvc.getTitleModes();
            vm.model.includedResponsesModes = exportResponsesSvc.getIncludedResponsesModes();
            vm.model.separatorModes = exportResponsesSvc.getSeparatorModes();
            setDefaultOptions();
            pushDownSvc.setLoadingStatus(true);
            return;

            function setDefaultOptions() {
                var defaultTitleMode = 0,
                    defaultIncludeResponsesMode = 1,
                    defaultSeparatorMode = 0;
                vm.model.titleMode = defaultTitleMode;
                vm.model.includedResponsesMode = defaultIncludeResponsesMode;
                vm.model.separatorMode = defaultSeparatorMode;
                vm.model.multipleSelectionAnswersAsSeparateColumns = false;
            }
        }

        function closeMe() {
            pushDownSvc.hidePushDown();
        }

        function exportResponses() {
            var exportSettingData = exportResponsesSvc.buildExportSettingData(vm.model),
                overlay = angular.element(document.querySelector('#overlay'));

            spinnerUtilSvc.showSpinner();
            exportResponsesDataSvc.exportResponses(exportSettingData, vm.testModeSettings.isActive).$promise.then(function (result) {
                spinnerUtilSvc.hideSpinner();

                exportResponsesSvc.buildFile(result.data, exportSettingData.exportResponsesSeparator, $scope.surveyName);
                vm.close();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError(error.data.data || 'Exporting responses report was not successful', error.data);
            });
        }

    }
})();