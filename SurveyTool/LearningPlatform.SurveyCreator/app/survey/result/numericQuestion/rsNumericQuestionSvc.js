(function () {
    'use strict';

    angular.module('svt').service('rsNumericQuestionSvc', rsNumericQuestionSvc);

    function rsNumericQuestionSvc() {
        return {
            renderChart: renderChart
        };

        function renderChart(aggregatedQuestion) {
            var colors = [
                '#AA4643',
                '#89A54E',
                '#80699B',
                '#3D96AE',
                '#DB843D',
                '#92A8CD',
                '#A47D7C',
                '#B5CA92'
            ];
            var categories = [];
            var seriesData = [];

            for (var i = 0; aggregatedQuestion.answers && i < aggregatedQuestion.answers.length; i++) {
                var optionValue = aggregatedQuestion.answers[i];
                categories.push(optionValue.optionText);
                seriesData.push({ name: optionValue.optionText, y: optionValue.count, color: colors[i] });
            }

            return {
                options: {
                    chart: {
                        type: 'column'
                    }
                },
                series: [
                    {
                        name: 'Number of choices',
                        data: seriesData
                    }
                ],
                title: {
                    text: null
                },
                loading: false,
                xAxis: {
                    categories: categories
                },
                yAxis: {
                    allowDecimals: false
                },
                useHighStocks: false
            };
        }
    }
})();