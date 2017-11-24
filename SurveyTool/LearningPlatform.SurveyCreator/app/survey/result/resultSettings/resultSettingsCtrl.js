(function () {
    angular
        .module('svt')
        .controller('resultSettingsCtrl', resultSettingsCtrl);

    resultSettingsCtrl.$inject = ['$scope', 'spinnerUtilSvc', 'reportDataSvc'];

    function resultSettingsCtrl($scope, spinnerUtilSvc, reportDataSvc) {
        var vm = this;

        vm.toogleDataTable = toogleDataTable;

        function toogleDataTable() {
            var settings = {
                reportPageId: $scope.data.reportPageId,
                displaySummaryTabular: !$scope.data.isDisplaySummaryTabular
            };

            spinnerUtilSvc.showSpinner();
            reportDataSvc.updateReportByViewTable($scope.surveyId, settings).$promise.then(function () {
                $scope.data.isDisplaySummaryTabular = settings.displaySummaryTabular;
                $scope.data.questions.forEach(function (reportElement) {
                    reportElement.questionSetting.displaySummaryTabular = $scope.data.isDisplaySummaryTabular;
                });
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Updating Display Table was not successful.', error);
            });
        }
    }
})();