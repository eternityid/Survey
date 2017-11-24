(function () {
    'use strict';

    angular.module('svt').service('rpSelectionQuestionSvc', rpSelectionQuestionSvc);

    rpSelectionQuestionSvc.$inject = ['reportSvc', 'settingConst'];

    function rpSelectionQuestionSvc(reportSvc, settingConst) {
        return {
            renderChart: renderChart,
            renderTable: renderTable
        };

        function renderChart(aggregatedQuestion) {
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
            }

            var chart = reportSvc.getSelectionChartType(dataChart.categories, dataChart.series, aggregatedQuestion);
            if (isNetPromoterQuestion) {
                chart.subtitle = {
                    text: 'Net Promoter Score \u00AE: ' + dataChart.nps + '%'
                };
            }
            return chart;
        }

        function renderTable(aggregatedQuestion) {
            return {
                columns: renderColumnTitles(),
                rows: renderRows()
            };

            function renderColumnTitles() {
                return [ "Option", "Response", "Percentage" ];
            }

            function renderRows() {
                var aggregatedOptions = aggregatedQuestion.answers;
                var rows = [];

                for (var i = 0; i < aggregatedOptions.length; i++) {
                    rows.push({
                        optionText: aggregatedOptions[i].optionText,
                        count: aggregatedOptions[i].count,
                        percentage: aggregatedOptions[i].percentage
                    });
                }
                return rows;
            }
        }
    }
})();