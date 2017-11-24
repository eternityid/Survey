(function () {
    'use strict';

    angular
        .module('svt')
        .factory('surveyDashboardSvc', surveyDashboardSvc);

    function surveyDashboardSvc() {
        return {
            renderResponsesStatus: renderResponsesStatus,
            renderBarChart: renderBarChart,
            renderLineChart: renderLineChart
        };

        function renderResponsesStatus(dashboardData) {
            var responsesStatus = {
                total: {
                    title: 'total',
                    value: 0
                },
                dropoutRate: {
                    title: 'dropout rate',
                    value: 0
                },
                started: {
                    title: 'started',
                    value: 0
                },
                inprogress: {
                    title: 'in progress',
                    value: 0
                },
                completed: {
                    title: 'completed',
                    value: 0
                }
            };
            if (dashboardData) {
                responsesStatus.total.value = dashboardData.total;
                responsesStatus.dropoutRate.value = dashboardData.dropoutRate;
                responsesStatus.started.value = dashboardData.started;
                responsesStatus.inprogress.value = dashboardData.inProgress;
                responsesStatus.completed.value = dashboardData.completed;
            }
            responsesStatus.maxDataLength = calculateMaxLength(responsesStatus);
            return responsesStatus;

            function calculateMaxLength(responses) {
                var tempLengths = [];
                tempLengths.push(responses.total.value.toString().length);
                tempLengths.push(responses.dropoutRate.value.toString().length + 1);
                tempLengths.push(responses.started.value.toString().length);
                tempLengths.push(responses.inprogress.value.toString().length);
                tempLengths.push(responses.completed.value.toString().length);

                return Math.max.apply(Math, tempLengths);
            }
        }

        function renderBarChart(dashboardData) {
            return buildBarChartData(buildSeriesData());

            function buildSeriesData() {
                var colors = ['#5bc0de', '#337ab7', '#5cb85c'];
                var series = [{
                    name: 'TOTAL',
                    data: [0],
                    color: colors[0]
                }, {
                    name: 'STARTED',
                    data: [0],
                    color: colors[1]
                }, {
                    name: 'COMPLETED',
                    data: [0],
                    color: colors[2]
                }];

                if (dashboardData) {
                    series[0].data[0] = dashboardData.total;
                    series[1].data[0] = dashboardData.started;
                    series[2].data[0] = dashboardData.completed;
                }

                return series;
            }

            function buildBarChartData(series) {
                var categories = ['RESPONSES'];
                return {
                    options: {
                        chart: {
                            type: 'column',
                            backgroundColor: 'transparent'
                        },
                        plotOptions: {
                            column: {
                                dataLabels: { enabled: true },
                                enableMouseTracking: true
                            }
                        },
                        legend: { enabled: false }
                    },
                    title: { text: null },
                    xAxis: {
                        categories: categories,
                        labels: { enabled: false }
                    },
                    yAxis: {
                        title: { text: null },
                        labels: { enabled: false },
                        gridLineWidth: 0,
                        min: 0,
                        minRange: 0.1
                    },
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    series: series
                };
            }
        }

        function renderLineChart(dashboardData) {
            return buildLineChartData(buildSeriesAndCategories());

            function buildSeriesAndCategories() {
                var colors = ['#337ab7', '#5cb85c'];
                var categories = [];
                var series = [{
                    name: 'STARTED',
                    data: [],
                    color: colors[0]
                }, {
                    name: 'COMPLETED',
                    data: [],
                    color: colors[1]
                }];

                if (dashboardData && dashboardData.trend) {
                    var trendPoints = dashboardData.trend.points;
                    for (var i = 0; i < trendPoints.length; i++) {
                        categories.push(formatDate(new Date(trendPoints[i].at)));
                        series[0].data.push(trendPoints[i].started);
                        series[1].data.push(trendPoints[i].completed);
                    }
                } else {
                    var currentDate = new Date();
                    var dayTo = new Date(currentDate);
                    var dayFrom = new Date(currentDate.setDate(currentDate.getDate() - 13));

                    for (var day = dayFrom; day <= dayTo; day.setDate(day.getDate() + 1)) {
                        categories.push(formatDate(new Date(day)));
                        series[0].data.push(0);
                        series[1].data.push(0);
                    }
                }

                return {
                    categories: categories,
                    series: series
                };

                function formatDate(date) {
                    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                }

            }

            function buildLineChartData(seriesAndCategories) {
                var chart = {
                    options: {
                        chart: {
                            type: 'line',
                            backgroundColor: 'transparent'
                        },
                        legend: { enabled: false }
                    },
                    title: { text: null },
                    xAxis: {
                        categories: seriesAndCategories.categories,
                        labels: { enabled: false }
                    },
                    yAxis: {
                        title: { text: null },
                        labels: { enabled: false },
                        gridLineWidth: 0,
                        min: 0,
                        minRange: 0.1
                    },
                    plotOptions: {
                        line: {
                            softThreshold: false
                        }
                    },
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    series: seriesAndCategories.series
                };

                if (!dashboardData || !dashboardData.trend || !isSeriesHasActualData()) {
                    chart.yAxis.max = 1;
                }
                return chart;

                function isSeriesHasActualData() {
                    for (var i = 0; i < seriesAndCategories.series.length; i++) {
                        var hasActualData = seriesAndCategories.series[i].data.some(function (element) {
                            return element !== 0;
                        });
                        if (hasActualData) return true;
                    }
                    return false;
                }
            }
        }
    }
})();