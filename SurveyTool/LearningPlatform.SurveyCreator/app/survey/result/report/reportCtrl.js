(function () {
    'use trict';

    angular.module('svt').controller('reportCtrl', reportCtrl);

    reportCtrl.$inject = [
        '$routeParams', '$scope', 'reportDataSvc', 'errorHandlingSvc',
        'reportSvc', 'settingConst', 'testModeSvc', 'spinnerUtilSvc',
        'surveyMenuSvc', 'reportConst'
    ];

    function reportCtrl($routeParams, $scope, reportDataSvc, errorHandlingSvc,
        reportSvc, settingConst, testModeSvc, spinnerUtilSvc,
        surveyMenuSvc, reportConst) {
        var vm = this;

        vm.surveyId = $routeParams.id;
        vm.reportTitleDisplay = 'Loading report ...';
        vm.totalRespondents = 0;
        vm.isDisplaySummaryTabular = null;
        vm.responsesReport = [];
        vm.questionTypes = settingConst.questionTypes;
        vm.chartQuestionGroups = settingConst.report.chartQuestionGroups;
        vm.getCssByColumnWidth = getCssByColumnWidth;
        vm.printReport = printReport;
        vm.chartTitleSize = reportConst.chartTitle.size;
        vm.init = init;

        init();

        function init() {
            surveyMenuSvc.updateMenuForSurveyResults(vm.surveyId);
            vm.testModeSettings = testModeSvc.getTestModeSettings(vm.surveyId);
            onChangeTestMode();
        }

        function onChangeTestMode() {
            $scope.$watch('vm.testModeSettings.isActive', function () {
                buildReport();
            });
        }

        function buildReport() {
            spinnerUtilSvc.showSpinner();
            reportDataSvc.getData(vm.surveyId, vm.testModeSettings.isActive).$promise.then(function (result) {
                vm.result = result;

                vm.result.questions.forEach(function (reportElement) {
                    reportElement.questionSetting.displaySummaryTabular = vm.result.isDisplaySummaryTabular;
                });
                vm.totalRespondents = vm.result.totalRespondents;

                if (vm.totalRespondents !== 0) {
                    vm.responsesReport = vm.result.questions;
                    vm.reportTitleDisplay = 'Summary report. Number of respondents: ' + vm.totalRespondents + '.';
                } else {
                    vm.reportTitleDisplay = 'There is no data for report';
                }
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                vm.reportTitleDisplay = 'There is no data for report';
                errorHandlingSvc.manifestError('Getting reporting data was not successful.', error);
            });
        }

        function getCssByColumnWidth(columnWidth) {
            if (columnWidth === settingConst.result.columnWidth.twoCols) return 'col-xs-12 col-sm-6 col-md-6';
            if (columnWidth === settingConst.result.columnWidth.threeCols) return 'col-xs-12 col-sm-6 col-md-4';
            if (columnWidth === settingConst.result.columnWidth.oneCol) return 'col-xs-12 col-sm-12 col-md-8';
            if (columnWidth === settingConst.result.columnWidth.fullWidth) return 'col-xs-12 col-sm-12 col-md-12';
            return 'col-xs-12 col-sm-6 col-md-6';
        }

        function printReport() {
            $scope.isPrintReport = true;
        }
    }
})();