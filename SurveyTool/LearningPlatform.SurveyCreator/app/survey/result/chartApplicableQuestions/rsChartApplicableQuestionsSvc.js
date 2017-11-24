(function() {
    angular.module('svt').service('rsChartApplicableQuestionsSvc', rsChartApplicableQuestionsSvc);
    rsChartApplicableQuestionsSvc.$inject = [
        'settingConst', 'rpSelectionQuestionSvc', 'rpSelectionGridQuestionSvc', 'reportSvc',
        'arrayUtilSvc'
    ];

    function rsChartApplicableQuestionsSvc(
        settingConst, rpSelectionQuestionSvc, rpSelectionGridQuestionSvc, reportSvc,
        arrayUtilSvc) {
        var service = {
            renderTable: renderTable,
            buildChartData: buildChartData,
            renderChart: renderChart
        };
        return service;

        function renderTable(aggregatedQuestion, chartQuestionGroup) {
            var chartQuestionGroups = settingConst.report.chartQuestionGroups;
            if (arrayUtilSvc.hasValueIn([chartQuestionGroups.likert, chartQuestionGroups.selection], chartQuestionGroup)) {
                return rpSelectionQuestionSvc.renderTable(aggregatedQuestion);
            }
            if (chartQuestionGroup === chartQuestionGroups.gridSelection) return rpSelectionGridQuestionSvc.renderTable(aggregatedQuestion);
            return null;
        }

        function buildChartData(aggregatedQuestion, chartQuestionGroup) {
            var chartQuestionGroups = settingConst.report.chartQuestionGroups;
            if (chartQuestionGroup === chartQuestionGroups.likert) return buildChartDataWithLikertGroup();
            if (chartQuestionGroup === chartQuestionGroups.selection) return buildChartDataWithSelectionGroup();
            if (chartQuestionGroup === chartQuestionGroups.gridSelection) return buildChartDataWithSelectionGridGroup();
            return {};

            function buildChartDataWithLikertGroup() {
                var dataChart = {},
                    chartType = aggregatedQuestion.questionSetting.chartType,
                    chartTypes = settingConst.report.chartType;
                var isNetPromoterQuestion = aggregatedQuestion.questionType === settingConst.questionTypes.NetPromoterScoreQuestionDefinition.code;

                switch (chartType) {
                    case chartTypes.column:
                    case chartTypes.pie:
                    case chartTypes.bar:
                        dataChart = isNetPromoterQuestion ?
                            reportSvc.getSeriesForNetPromoter(aggregatedQuestion, false) :
                            reportSvc.getSeriesForLikert(aggregatedQuestion);
                        break;
                    case chartTypes.stackedColumn:
                    case chartTypes.stackedBar:
                    case chartTypes.stackedPercentageColumn:
                    case chartTypes.stackedPercentageBar:
                        dataChart = isNetPromoterQuestion ?
                            reportSvc.getSeriesForNetPromoter(aggregatedQuestion, true) :
                            reportSvc.getSeries(aggregatedQuestion);
                        break;
                }
                return dataChart;
            }

            function buildChartDataWithSelectionGroup() {
                return reportSvc.getSeriesForPieChart(aggregatedQuestion);
            }

            function buildChartDataWithSelectionGridGroup() {
                return reportSvc.getSeriesForGrid(aggregatedQuestion.topics);
            }
        }

        function renderChart(aggregatedQuestion, dataChart, chartQuestionGroup) {
            var chartQuestionGroups = settingConst.report.chartQuestionGroups;
            if (chartQuestionGroup === chartQuestionGroups.likert) return renderChartWithLikertGroup();
            if (chartQuestionGroup === chartQuestionGroups.selection) return renderChartWithSelectionGroup();
            if (chartQuestionGroup === chartQuestionGroups.gridSelection) return renderChartWithSelectionGridGroup();
            return {};

            function renderChartWithLikertGroup() {
                var chartType = aggregatedQuestion.questionSetting.chartType,
                    stackCategoryName = ['Answers'],
                    chartTypes = settingConst.report.chartType,
                    chart = {};

                switch (chartType) {
                    case chartTypes.column:
                    case chartTypes.bar:
                    case chartTypes.pie:
                        chart = reportSvc.getSelectionChartType(dataChart.categories, dataChart.series, aggregatedQuestion);
                        break;
                    case chartTypes.stackedColumn:
                        chart = reportSvc.getStackedColumnChartType(chartTypes.column, aggregatedQuestion.questionText, stackCategoryName, dataChart.series);
                        break;
                    case chartTypes.stackedBar:
                        chart = reportSvc.getStackedBarChartType(chartTypes.bar, aggregatedQuestion.questionText, stackCategoryName, dataChart.series);
                        break;
                    case chartTypes.stackedPercentageColumn:
                        chart = reportSvc.getStackedPercentageColumnChartType(chartTypes.column, aggregatedQuestion.questionText, stackCategoryName, dataChart.series);
                        break;
                    case chartTypes.stackedPercentageBar:
                        chart = reportSvc.getStackedPercentageBarChartType(chartTypes.bar, aggregatedQuestion.questionText, stackCategoryName, dataChart.series);
                        break;
                }
                return chart;
            }

            function renderChartWithSelectionGroup() {
                return reportSvc.getSelectionChartType(dataChart.categories, dataChart.series, aggregatedQuestion);
            }

            function renderChartWithSelectionGridGroup() {
                var chartType = aggregatedQuestion.questionSetting.chartType,
                    chartTypes = settingConst.report.chartType,
                    chart = {};

                switch (chartType) {
                    case chartTypes.line:
                        chart = reportSvc.getLineChartType(chartTypes.line, aggregatedQuestion.questionText, dataChart.categories, dataChart.series);
                        break;
                    case chartTypes.area:
                        chart = reportSvc.getAreaChartType(chartTypes.area, aggregatedQuestion.questionText, dataChart.categories, dataChart.series);
                        break;
                    case chartTypes.stackedArea:
                        chart = reportSvc.getStackedAreaChartType(chartTypes.area, aggregatedQuestion.questionText, dataChart.categories, dataChart.series);
                        break;
                    case chartTypes.stackedColumn:
                        chart = reportSvc.getStackedColumnChartType(chartTypes.column, aggregatedQuestion.questionText, dataChart.categories, dataChart.series);
                        break;
                    case chartTypes.stackedBar:
                        chart = reportSvc.getStackedBarChartType(chartTypes.bar, aggregatedQuestion.questionText, dataChart.categories, dataChart.series);
                        break;
                    case chartTypes.stackedPercentageColumn:
                        chart = reportSvc.getStackedPercentageColumnChartType(chartTypes.column, aggregatedQuestion.questionText, dataChart.categories, dataChart.series);
                        break;
                    case chartTypes.stackedPercentageBar:
                        chart = reportSvc.getStackedPercentageBarChartType(chartTypes.bar, aggregatedQuestion.questionText, dataChart.categories, dataChart.series);
                        break;
                }
                return chart;
            }
        }
    }
})();