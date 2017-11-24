(function () {
    'use strict';

    angular.module('svt').service('reportSvc', reportSvc);

    reportSvc.$inject = ['settingConst', '$timeout', 'objectUtilSvc', 'stringUtilSvc'];

    function reportSvc(settingConst, $timeout, objectUtilSvc, stringUtilSvc) {
        var suffixText = ' selection(s)';

        var service = {
            getSeries: getSeries,
            getSeriesForLikert: getSeriesForLikert,
            getSeriesForNetPromoter: getSeriesForNetPromoter,
            getSeriesForGrid: getSeriesForGrid,
            getSeriesForPieChart: getSeriesForPieChart,
            getNetPromoterData: getNetPromoterData,

            getSelectionChartType: getSelectionChartType,
            getStackedColumnChartType: getStackedColumnChartType,
            getStackedBarChartType: getStackedBarChartType,

            getLineChartType: getLineChartType,
            getAreaChartType: getAreaChartType,
            getStackedAreaChartType: getStackedAreaChartType,
            getStackedPercentageColumnChartType: getStackedPercentageColumnChartType,
            getStackedPercentageBarChartType: getStackedPercentageBarChartType,

            getChartTypes: getChartTypes,
            getQuestionSetting: getQuestionSetting,

            checkEmptyPieChart: checkEmptyPieChart
        };

        return service;


        function getSeries(aggregatedQuestion) {
            var series = [];
            var aggregatedOptions = aggregatedQuestion.answers;

            for (var i = 0; i < aggregatedOptions.length; i++) {
                series.push({ "name": aggregatedOptions[i].optionText, "data": [aggregatedOptions[i].count] });
            }
            return { series: series };
        }

        function getSeriesForLikert(aggregatedQuestion) {
            var categories = [];
            var seriesData = [];
            for (var i = 0; i < aggregatedQuestion.answers.length; i++) {
                var optionValue = aggregatedQuestion.answers[i];
                categories.push(optionValue.optionText);
                seriesData.push({ name: optionValue.optionText, y: optionValue.count });
            }
            return { categories: categories, series: seriesData };
        }

        function getSeriesForNetPromoter(aggregatedQuestion, isStackChart) {
            var netPromoterData = getNetPromoterData(aggregatedQuestion),
                nps = netPromoterData.nps;

            var netPromotorScoreQuestionLabels = settingConst.report.netPromotorScoreQuestionLabels;
            var categories = [netPromotorScoreQuestionLabels.promoters, netPromotorScoreQuestionLabels.passives, netPromotorScoreQuestionLabels.detractors];
            var dataSeries = [
                { name: netPromotorScoreQuestionLabels.promoters, y: netPromoterData.promoters },
                { name: netPromotorScoreQuestionLabels.passives, y: netPromoterData.passives },
                { name: netPromotorScoreQuestionLabels.detractors, y: netPromoterData.detractors }
            ];
            var dataStackSeries = [
                { name: netPromotorScoreQuestionLabels.promoters, data: [netPromoterData.promoters] },
                { name: netPromotorScoreQuestionLabels.passives, data: [netPromoterData.passives] },
                { name: netPromotorScoreQuestionLabels.detractors, data: [netPromoterData.detractors] }
            ];
            var series = isStackChart ? dataStackSeries : dataSeries;

            return {
                nps: nps.toFixed(2),
                categories: categories,
                series: series
            };
        }

        function getSeriesForGrid(aggregatedQuestion) {
            var categories = [];
            var series = [];
            var isInitialized = false;

            (aggregatedQuestion || []).forEach(function (questionValue) {
                var i = 0;
                categories.push(questionValue.questionText);
                for (var j = 0; j < questionValue.answers.length; j++) {
                    if (!isInitialized) {
                        series.push({ "name": questionValue.answers[j].optionText, "data": [questionValue.answers[j].count] });
                    } else {
                        series[i].data.push(questionValue.answers[j].count);
                        i++;
                    }
                }
                isInitialized = true;
            });

            return { categories: categories, series: series };
        }

        function getSeriesForPieChart(aggregatedQuestion) {
            var colors = [
                '#4572A7',
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
            if (aggregatedQuestion.answers) {
                for (var i = 0; i < aggregatedQuestion.answers.length; i++) {
                    var optionValue = aggregatedQuestion.answers[i];
                    categories.push(optionValue.optionText);
                    seriesData.push({ name: optionValue.optionText, y: optionValue.count, color: colors[i] });
                }
            }
            return { categories: categories, series: seriesData };
        }

        function getNetPromoterData(aggregatedQuestion) {
            var detractors = 0,
                passives = 0,
                promoters = 0,
                score = 0;

            var aggregatedOptions = aggregatedQuestion.answers;
            if (aggregatedOptions && Object.keys(aggregatedOptions).length > 0) {
                for (var i = 0; i <= 6; i++) {
                    detractors += aggregatedOptions[i].count;
                }
                for (var j = 7; j <= 8; j++) {
                    passives += aggregatedOptions[j].count;
                }
                for (var k = 9; k <= 10; k++) {
                    promoters += aggregatedOptions[k].count;
                }

                var sum = detractors + passives + promoters;
                score = Number(sum) > 0 ? (promoters / sum - detractors / sum) * 100 : 0;
            }

            return {
                detractors: detractors,
                passives: passives,
                promoters: promoters,
                nps: score
            };
        }

        function getChart(chartType, title, categories, series) {
            return {
                title: {
                    text: stringUtilSvc.getPlainText(title)
                },
                xAxis: {
                    categories: categories
                },
                options: {
                    chart: {
                        type: chartType
                    }
                },
                series: series
            };
        }

        function getSelectionChartType(categories, series, question) {
            var chart = getChart(question.questionSetting.chartType, question.questionText, categories, series);
            chart.options.chart = {
                type: question.questionSetting.chartType
            };

            chart.options.plotOptions = objectUtilSvc.createObjectFrom(chart.options.plotOptions);
            if (question.questionSetting.chartType !== settingConst.report.chartType.pie) {
                chart.options.tooltip = {
                    pointFormat: '{series.name}: <b>{point.y}</b>',
                    valueSuffix: suffixText
                };
            } else {
                var pieConfig = settingConst.result.pie;
                var questionColumnWidth = question.questionSetting.columnWidth ?
                    question.questionSetting.columnWidth : settingConst.result.columnWidth.twoCols;
                var columnWidthPercentage = questionColumnWidth / 100;
                var dataLabelsWidth = columnWidthPercentage * pieConfig.labelDefaultWidth;
                var distanceFromLabelsToPieEdge = columnWidthPercentage * pieConfig.defaultDistanceFromLabelsToPieEdge;
                chart.options.plotOptions.pie = {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        distance: distanceFromLabelsToPieEdge,
                        style: {
                            width: dataLabelsWidth
                        },
                        formatter: function () {
                            return stringUtilSvc.formatByArray("{0}: {1}% ({2})", [
                                pieTruncateFormatter(this.key),
                                Math.round(this.percentage),
                                this.y
                            ]);
                        }
                    },
                    showInLegend: true,
                    minSize: pieConfig.minSize
                };

                if (isMultiSelectionQuestion()) {
                    chart.options.tooltip = {
                        pointFormat: '{series.name}: <b>{point.y}</b>',
                        valueSuffix: suffixText
                    };
                } else {
                    chart.options.tooltip = {
                        pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>',
                        valueSuffix: suffixText
                    };
                }
            }

            chart.series = [
                {
                    name: 'Responded',
                    colorByPoint: true,
                    data: series,
                    showInLegend: false
                }
            ];

            chart.loading = false;
            chart.xAxis = {
                allowDecimals: false,
                categories: categories
            };

            chart.yAxis = {
                allowDecimals: false,
                labels: {
                    formatter: function () {
                        return Number(this.value) === parseInt(this.value) ? this.value : '';
                    }
                }
            };

            chart.useHighStocks = false;
            return chart;

            function isMultiSelectionQuestion() {
                return question.questionType === settingConst.questionTypes.MultipleSelectionQuestionDefinition.code;
            }
            function pieTruncateFormatter(labelText) {
                var smallAmountOfOptions = 2;
                var indexOfTruncateWord = null;
                if (questionColumnWidth === settingConst.result.columnWidth.threeCols) {
                    indexOfTruncateWord = question.answers.length <= smallAmountOfOptions ?
                        pieConfig.truncate.maxWordNumber : pieConfig.truncate.minWordNumber;
                }
                else if (questionColumnWidth === settingConst.result.columnWidth.twoCols) {
                    indexOfTruncateWord = question.answers.length <= smallAmountOfOptions ?
                        pieConfig.truncate.maxWordNumber : pieConfig.truncate.averageWordNumber;
                }
                else if (questionColumnWidth >= settingConst.result.columnWidth.oneCol) {
                    indexOfTruncateWord = question.answers.length <= smallAmountOfOptions ?
                        pieConfig.truncate.safeWordNumber : pieConfig.truncate.maxWordNumber;
                }
                var isIndexOfLastWord = Math.ceil(indexOfTruncateWord) === stringUtilSvc.countWordsInString(labelText);
                var appendValue = ' ...';
                appendValue = isIndexOfLastWord ? '' : appendValue;
                var outputString = stringUtilSvc.truncateByWordAmount(labelText, indexOfTruncateWord, appendValue);
                return outputString;
            }
        }

        function getStackedColumnChartType(chartType, title, categories, series) {
            var chart = getChart(chartType, title, categories, series);

            chart.options.plotOptions = {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black'
                        }
                    }
                }
            };

            chart.options.tooltip = {
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>' +
                        'Total: ' + this.point.stackTotal;
                },
                valueSuffix: suffixText
            };

            chart.xAxis.labels = {
                formatter: function () {
                    //TODO move defaultNumber to config
                    return stringUtilSvc.truncateByWordAmount(this.value, settingConst.result.area.truncate.defaultNumber, '...');
                }
            };

            chart.yAxis = {
                allowDecimals: false,
                labels: {
                    formatter: function () {
                        return Number(this.value) === parseInt(this.value) ? this.value : '';
                    }
                }
            };

            return chart;
        }

        function getStackedBarChartType(chartType, title, categories, series) {
            var chart = getChart(chartType, title, categories, series);

            chart.options.plotOptions = {
                series: {
                    stacking: 'normal'
                }
            };

            chart.options.tooltip = {
                valueSuffix: suffixText
            };

            chart.yAxis = {
                allowDecimals: false,
                labels: {
                    formatter: function () {
                        return Number(this.value) === parseInt(this.value) ? this.value : '';
                    }
                }
            };

            return chart;
        }


        function getLineChartType(chartType, title, categories, series) {
            var chart = getChart(chartType, title, categories, series);

            chart.yAxis = {
                allowDecimals: false,
                labels: {
                    formatter: function () {
                        return Number(this.value) === parseInt(this.value) ? this.value : '';
                    }
                }
            };
            return chart;
        }

        function getAreaChartType(chartType, title, categories, series) {
            var chart = getChart(chartType, title, categories, series);

            chart.xAxis.labels = {
                formatter: function () {
                    return stringUtilSvc.truncateByWordAmount(this.value, settingConst.result.area.truncate.defaultNumber, '...');
                }
            };

            chart.yAxis = {
                allowDecimals: false,
                labels: {
                    formatter: function () {
                        return Number(this.value) === parseInt(this.value) ? this.value : '';
                    }
                }
            };

            return chart;
        }

        function getStackedAreaChartType(chartType, title, categories, series) {
            var chart = getChart(chartType, title, categories, series);

            chart.options.plotOptions = {
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                }
            };

            chart.options.tooltip = {
                shared: true,
                valueSuffix: suffixText
            };

            chart.xAxis.labels = {
                formatter: function () {
                    //TODO move defaultNumber to config
                    return stringUtilSvc.truncateByWordAmount(this.value, settingConst.result.area.truncate.defaultNumber, '...');
                }
            };

            chart.yAxis = {
                allowDecimals: false,
                labels: {
                    formatter: function () {
                        return Number(this.value) === parseInt(this.value) ? this.value : '';
                    }
                }
            };

            return chart;
        }

        function getStackedPercentageColumnChartType(chartType, title, categories, series) {
            var chart = getChart(chartType, title, categories, series);

            chart.options.plotOptions = {
                column: {
                    stacking: 'percent'
                }
            };

            chart.options.tooltip = {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                shared: true
            };

            chart.xAxis.labels = {
                formatter: function () {
                    //TODO move defaultNumber to config
                    return stringUtilSvc.truncateByWordAmount(this.value, settingConst.result.area.truncate.defaultNumber, '...');
                }
            };

            return chart;
        }

        function getStackedPercentageBarChartType(chartType, title, categories, series) {
            var chart = getChart(chartType, title, categories, series);

            chart.options.plotOptions = {
                bar: {
                    stacking: 'percent',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black, 0 0 3px black'
                        }
                    }
                }
            };

            chart.options.tooltip = {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                shared: true
            };

            return chart;
        }

        function getChartTypes(chartQuestionGroup) {
            var chartQuestionGroups = settingConst.report.chartQuestionGroups;

            if (chartQuestionGroup === chartQuestionGroups.selection) {
                return [
                    { "id": "column", "title": "Column" },
                    { "id": "bar", "title": "Bar" },
                    { "id": "pie", "title": "Pie" }
                ];
            }
            if (chartQuestionGroup === chartQuestionGroups.likert) {
                return [
                    { "id": "column", "title": "Column" },
                    { "id": "bar", "title": "Bar" },
                    { "id": "pie", "title": "Pie" },
                    { "id": "stacked_column", "title": "Stacked Column" },
                    { "id": "stacked_bar", "title": "Stacked Bar" },
                    { "id": "stacked_percentage_column", "title": "Stacked Percentage Column" },
                    { "id": "stacked_percentage_bar", "title": "Stacked Percentage Bar" }
                ];
            }
            if (chartQuestionGroup === chartQuestionGroups.gridSelection) {
                return [
                    { "id": "line", "title": "Line" },
                    { "id": "area", "title": "Area" },
                    { "id": "stacked_area", "title": "Stacked Area" },
                    { "id": "stacked_column", "title": "Stacked Column" },
                    { "id": "stacked_bar", "title": "Stacked Bar" },
                    { "id": "stacked_percentage_column", "title": "Stacked Percentage Column" },
                    { "id": "stacked_percentage_bar", "title": "Stacked Percentage Bar" }
                ];
            }
            return [];
        }

        function getQuestionSetting(chartType, surveyId, reportPageId, aggregatedQuestion) {
            return {
                surveyId: surveyId,
                questionAlias: aggregatedQuestion.questionName,
                chartType: chartType,
                displaySummaryTabular: aggregatedQuestion.questionSetting.displaySummaryTabular,
                reportPageId: reportPageId
            };
        }

        function checkEmptyPieChart(chartType, data) {
            if (chartType === settingConst.report.chartType.pie && data === 0) {
                return true;
            } else {
                return false;
            }
        }
    }
})();