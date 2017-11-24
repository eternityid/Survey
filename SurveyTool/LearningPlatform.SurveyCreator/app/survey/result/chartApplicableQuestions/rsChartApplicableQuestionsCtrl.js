(function() {
    angular.module('svt').controller('rsChartApplicableQuestionsCtrl', rsChartApplicableQuestionsCtrl);
    rsChartApplicableQuestionsCtrl.$inject = [
        '$scope', 'rsChartApplicableQuestionsSvc', 'reportDataSvc',
        'spinnerUtilSvc', 'settingConst', 'reportSvc', 'errorHandlingSvc', '$timeout', 'reportConst'];

    function rsChartApplicableQuestionsCtrl(
        $scope, rsChartApplicableQuestionsSvc, reportDataSvc,
        spinnerUtilSvc, settingConst, reportSvc, errorHandlingSvc, $timeout, reportConst) {

        var vm = this;

        vm.chartQuestionGroup = $scope.chartQuestionGroup;
        vm.chartTitleSize = $scope.chartTitleSize ? $scope.chartTitleSize : reportConst.chartTitle.size.view;
        vm.chartQuestionGroups = settingConst.report.chartQuestionGroups;

        vm.changeChartType = changeChartType;
        vm.displayReportByWidth = displayReportByWidth;
        vm.checkChartTypeSelected = checkChartTypeSelected;
        vm.checkColumnWidthSelected = checkColumnWidthSelected;
        vm.getChartTypeIcon = getChartTypeIcon;

        vm.init = init;

        init();

        function init() {
            vm.chartTypes = reportSvc.getChartTypes(vm.chartQuestionGroup);
            vm.selectedChartType = $scope.aggregatedQuestion.questionSetting.chartType;
            vm.isDisplaySummaryTabular = $scope.aggregatedQuestion.questionSetting.displaySummaryTabular;

            vm.totalRespondents = $scope.aggregatedQuestion.numberOfRespondents;
            vm.totalResponses = $scope.aggregatedQuestion.numberOfResponses;
            vm.isEmptyPieChart = reportSvc.checkEmptyPieChart(vm.selectedChartType, vm.totalResponses);

            vm.table = rsChartApplicableQuestionsSvc.renderTable($scope.aggregatedQuestion, vm.chartQuestionGroup);
            reloadChart();
        }

        function reloadChart() {
            var dataChart = rsChartApplicableQuestionsSvc.buildChartData($scope.aggregatedQuestion, vm.chartQuestionGroup);
            if (!dataChart) {
                vm.chart = {};
                return;
            }
            vm.chart = rsChartApplicableQuestionsSvc.renderChart($scope.aggregatedQuestion, dataChart, vm.chartQuestionGroup);
            if (!vm.chart.title) return;

            vm.chart.title.align = 'left';
            vm.chart.title.x = 5;
            vm.chart.title.y = 15;
            vm.chart.title.margin = reportConst.chartTitle.margin;
            vm.chart.title.style = { fontSize: vm.chartTitleSize };

            if ($scope.aggregatedQuestion.questionType === settingConst.questionTypes.NetPromoterScoreQuestionDefinition.code) {
                vm.chart.subtitle = {
                    text: 'Net Promoter Score \u00AE: ' + dataChart.nps + '%'
                };
            }
        }

        function changeChartType(chartType) {
            vm.isEmptyPieChart = reportSvc.checkEmptyPieChart(vm.selectedChartType, vm.totalResponses);

            var questionSetting = reportSvc.getQuestionSetting(chartType, $scope.surveyId, $scope.reportPageId, $scope.aggregatedQuestion);
            questionSetting.columnWidth = $scope.aggregatedQuestion.questionSetting.columnWidth ?
                $scope.aggregatedQuestion.questionSetting.columnWidth : 50;
            spinnerUtilSvc.showSpinner();
            reportDataSvc.updateQuestionViewChart(questionSetting.surveyId, questionSetting).$promise.then(function () {
                $scope.aggregatedQuestion.questionSetting.chartType = chartType;
                reloadChart();
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Updating chart type was not successful.', error);
            });
        }

        function displayReportByWidth(columnWidth) {
            var questionSetting = {
                surveyId: $scope.surveyId,
                questionAlias: $scope.aggregatedQuestion.questionName,
                chartType: vm.selectedChartType,
                displaySummaryTabular: vm.isDisplaySummaryTabular,
                columnWidth: columnWidth,
                reportPageId: $scope.reportPageId
            };

            spinnerUtilSvc.showSpinner();
            reportDataSvc.updateQuestionViewChart(questionSetting.surveyId, questionSetting).$promise.then(function () {
                $scope.columnWidth = columnWidth;
                spinnerUtilSvc.hideSpinner();
                $timeout(function () {
                    reloadChart();
                    $(window).resize();
                }, 0);
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Updating SummaryTabular status was not successful.', error);
            });
        }

        function checkChartTypeSelected(chartType) {
            return $scope.aggregatedQuestion.questionSetting.chartType === chartType;
        }

        function checkColumnWidthSelected(columnWidth) {
            if (!$scope.aggregatedQuestion.questionSetting.columnWidth) {
                return columnWidth === settingConst.result.columnWidth.twoCols;
            } else {
                return $scope.aggregatedQuestion.questionSetting.columnWidth === columnWidth;
            }
        }

        function getChartTypeIcon(chartType) {
            return 'rs-'  + chartType  + '-chart';
        }
    }
})();