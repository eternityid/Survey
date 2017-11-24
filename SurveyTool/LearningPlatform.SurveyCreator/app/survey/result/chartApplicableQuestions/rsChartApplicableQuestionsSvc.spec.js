(function() {
    describe('Testing rsChartApplicableQuestionsSvc service', function() {
        var svc,
            rpSelectionQuestionSvc,
            rpSelectionGridQuestionSvc,
            reportSvc;

        beforeEach(function() {
            module('svt');
            module(function($provide) {
                rpSelectionQuestionSvc = jasmine.createSpyObj('rpSelectionQuestionSvc', [
                    'renderTable'
                ]);
                $provide.value('rpSelectionQuestionSvc', rpSelectionQuestionSvc);

                rpSelectionGridQuestionSvc = jasmine.createSpyObj('rpSelectionGridQuestionSvc', [
                    'renderTable'
                ]);
                $provide.value('rpSelectionGridQuestionSvc', rpSelectionGridQuestionSvc);

                reportSvc = jasmine.createSpyObj('reportSvc', [
                    'getSeriesForNetPromoter', 'getSeriesForLikert', 'getSeries', 'getSeriesForPieChart',
                    'getSeriesForGrid', 'getSelectionChartType', 'getStackedColumnChartType',
                    'getStackedBarChartType', 'getStackedPercentageColumnChartType', 'getLineChartType',
                    'getStackedPercentageBarChartType', 'getAreaChartType', 'getStackedAreaChartType'
                ]);
                $provide.value('reportSvc', reportSvc);
            });

            inject(function($injector) {
                svc = $injector.get('rsChartApplicableQuestionsSvc');
            });
        });

        describe('Testing renderTable function', function () {
            var aggregatedQuestion = {},
                chartQuestionGroup;

            it('should render table with scale question type', function () {
                chartQuestionGroup = 2;

                svc.renderTable(aggregatedQuestion, chartQuestionGroup);

                expect(rpSelectionQuestionSvc.renderTable).toHaveBeenCalled();
            });

            it('should render table with selection question type', function () {
                chartQuestionGroup = 0;

                svc.renderTable(aggregatedQuestion, chartQuestionGroup);

                expect(rpSelectionQuestionSvc.renderTable).toHaveBeenCalled();
            });

            it('should render table with grid selection question type', function () {
                chartQuestionGroup = 1;

                svc.renderTable(aggregatedQuestion, chartQuestionGroup);

                expect(rpSelectionGridQuestionSvc.renderTable).toHaveBeenCalled();
            });

            it('should return null with invalid question type', function () {
                chartQuestionGroup = undefined;
                var result = svc.renderTable(aggregatedQuestion, chartQuestionGroup);

                expect(result).toEqual(null);
            });
        });

        describe('Testing buildChartData function', function() {
            var aggregatedQuestion = {
                    questionSetting: {}
                },
                chartQuestionGroup;

            it('should return empty object with invalid chart question group', function () {
                chartQuestionGroup = -1;

                var result = svc.buildChartData(aggregatedQuestion, chartQuestionGroup);

                expect(result).toEqual({});
            });

            describe('Testing buildChartDataWithLikertGroup function', function () {
                beforeEach(function() {
                    chartQuestionGroup = 2;
                });

                describe('With NPS question type', function () {
                    beforeEach(function() {
                        aggregatedQuestion.questionType = 6;
                    });

                    it('should build column chart data', function () {
                        aggregatedQuestion.questionSetting.chartType = 'column';

                        svc.buildChartData(aggregatedQuestion, chartQuestionGroup);

                        expect(reportSvc.getSeriesForNetPromoter).toHaveBeenCalled();
                    });

                    it('should build bar chart data', function () {
                        aggregatedQuestion.questionSetting.chartType = 'bar';

                        svc.buildChartData(aggregatedQuestion, chartQuestionGroup);

                        expect(reportSvc.getSeriesForNetPromoter).toHaveBeenCalled();
                    });

                    it('should build stacked column chart data', function () {
                        aggregatedQuestion.questionSetting.chartType = 'stacked_column';

                        svc.buildChartData(aggregatedQuestion, chartQuestionGroup);

                        expect(reportSvc.getSeriesForNetPromoter).toHaveBeenCalled();
                    });

                    it('should build stacked percentage bar chart data', function () {
                        aggregatedQuestion.questionSetting.chartType = 'stacked_percentage_bar';

                        svc.buildChartData(aggregatedQuestion, chartQuestionGroup);

                        expect(reportSvc.getSeriesForNetPromoter).toHaveBeenCalled();
                    });
                });

                describe('Without NPS question type', function () {
                    beforeEach(function () {
                        aggregatedQuestion.questionType = 0;
                    });

                    it('should build pie chart data', function () {
                        aggregatedQuestion.questionSetting.chartType = 'pie';

                        svc.buildChartData(aggregatedQuestion, chartQuestionGroup);

                        expect(reportSvc.getSeriesForLikert).toHaveBeenCalled();
                    });

                    it('should build bar chart data', function () {
                        aggregatedQuestion.questionSetting.chartType = 'bar';

                        svc.buildChartData(aggregatedQuestion, chartQuestionGroup);

                        expect(reportSvc.getSeriesForLikert).toHaveBeenCalled();
                    });

                    it('should build stacked bar chart data', function () {
                        aggregatedQuestion.questionSetting.chartType = 'stacked_bar';

                        svc.buildChartData(aggregatedQuestion, chartQuestionGroup);

                        expect(reportSvc.getSeries).toHaveBeenCalled();
                    });

                    it('should build stacked percentage bar chart data', function () {
                        aggregatedQuestion.questionSetting.chartType = 'stacked_percentage_bar';

                        svc.buildChartData(aggregatedQuestion, chartQuestionGroup);

                        expect(reportSvc.getSeries).toHaveBeenCalled();
                    });
                });
            });

            describe('Testing buildChartDataWithSelectionGroup function', function() {
                beforeEach(function () {
                    chartQuestionGroup = 0;
                });

                it('should build pie chart data with selection question group', function() {
                    svc.buildChartData(aggregatedQuestion, chartQuestionGroup);

                    expect(reportSvc.getSeriesForPieChart).toHaveBeenCalled();
                });
            });

            describe('Testing buildChartDataWithSelectionGridGroup function', function () {
                beforeEach(function () {
                    chartQuestionGroup = 1;
                });

                it('should build chart data with grid selection question group', function () {
                    svc.buildChartData(aggregatedQuestion, chartQuestionGroup);

                    expect(reportSvc.getSeriesForGrid).toHaveBeenCalled();
                });
            });
        });

        describe('Testing renderChart function', function() {
            var aggregatedQuestion = {
                questionSetting: {}
            };
            var dataChart = {}, chartQuestionGroup;

            it('should return empty object with invalid chart question group', function() {
                chartQuestionGroup = -1;

                var result = svc.renderChart(aggregatedQuestion, dataChart, chartQuestionGroup);

                expect(result).toEqual({});
            });

            describe('Testing renderChartWithLikertGroup function', function () {
                beforeEach(function() {
                    chartQuestionGroup = 2;
                });

                it('should render column chart', function () {
                    aggregatedQuestion.questionSetting.chartType = 'column';

                    svc.renderChart(aggregatedQuestion, dataChart, chartQuestionGroup);

                    expect(reportSvc.getSelectionChartType).toHaveBeenCalled();
                });

                it('should render stacked column chart', function () {
                    aggregatedQuestion.questionSetting.chartType = 'stacked_column';

                    svc.renderChart(aggregatedQuestion, dataChart, chartQuestionGroup);

                    expect(reportSvc.getStackedColumnChartType).toHaveBeenCalled();
                });

                it('should render stacked bar chart', function () {
                    aggregatedQuestion.questionSetting.chartType = 'stacked_bar';

                    svc.renderChart(aggregatedQuestion, dataChart, chartQuestionGroup);

                    expect(reportSvc.getStackedBarChartType).toHaveBeenCalled();
                });

                it('should render stacked percentage column chart', function () {
                    aggregatedQuestion.questionSetting.chartType = 'stacked_percentage_column';

                    svc.renderChart(aggregatedQuestion, dataChart, chartQuestionGroup);

                    expect(reportSvc.getStackedPercentageColumnChartType).toHaveBeenCalled();
                });

                it('should render stacked percentage bar chart', function () {
                    aggregatedQuestion.questionSetting.chartType = 'stacked_percentage_bar';
                    reportSvc.getStackedPercentageBarChartType.and.returnValue({});

                    var result = svc.renderChart(aggregatedQuestion, dataChart, chartQuestionGroup);

                    expect(reportSvc.getStackedPercentageBarChartType).toHaveBeenCalled();
                    expect(result).toBeDefined();
                });
            });

            describe('Testing renderChartWithSelectionGroup function', function() {
                it('should render chart with selection question group', function () {
                    chartQuestionGroup = 0;
                    reportSvc.getSelectionChartType.and.returnValue({});

                    var result = svc.renderChart(aggregatedQuestion, dataChart, chartQuestionGroup);

                    expect(reportSvc.getSelectionChartType).toHaveBeenCalled();
                    expect(result).toBeDefined();
                });
            });

            describe('Testing renderChartWithSelectionGridGroup function', function() {
                beforeEach(function () {
                    aggregatedQuestion.questionText = 'dummy';
                    chartQuestionGroup = 1;
                    dataChart.categories = {};
                    dataChart.series = {};
                });

                it('should render line chart', function () {
                    aggregatedQuestion.questionSetting.chartType = 'line';

                    svc.renderChart(aggregatedQuestion, dataChart, chartQuestionGroup);

                    expect(reportSvc.getLineChartType).toHaveBeenCalled();
                });

                it('should render area chart', function () {
                    aggregatedQuestion.questionSetting.chartType = 'area';

                    svc.renderChart(aggregatedQuestion, dataChart, chartQuestionGroup);

                    expect(reportSvc.getAreaChartType).toHaveBeenCalled();
                });

                it('should render stacked area chart', function () {
                    aggregatedQuestion.questionSetting.chartType = 'stacked_area';

                    svc.renderChart(aggregatedQuestion, dataChart, chartQuestionGroup);

                    expect(reportSvc.getStackedAreaChartType).toHaveBeenCalled();
                });

                it('should render stacked column chart', function () {
                    aggregatedQuestion.questionSetting.chartType = 'stacked_column';

                    svc.renderChart(aggregatedQuestion, dataChart, chartQuestionGroup);

                    expect(reportSvc.getStackedColumnChartType).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), {}, jasmine.any(Object));
                });

                it('should render stacked bar chart', function () {
                    aggregatedQuestion.questionSetting.chartType = 'stacked_bar';

                    svc.renderChart(aggregatedQuestion, dataChart, chartQuestionGroup);

                    expect(reportSvc.getStackedBarChartType).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), {}, jasmine.any(Object));
                });

                it('should render stacked percentage column chart', function () {
                    aggregatedQuestion.questionSetting.chartType = 'stacked_percentage_column';

                    svc.renderChart(aggregatedQuestion, dataChart, chartQuestionGroup);

                    expect(reportSvc.getStackedPercentageColumnChartType).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), {}, jasmine.any(Object));
                });

                it('should render stacked percentage bar chart', function () {
                    aggregatedQuestion.questionSetting.chartType = 'stacked_percentage_bar';
                    reportSvc.getStackedPercentageBarChartType.and.returnValue({});

                    var result = svc.renderChart(aggregatedQuestion, dataChart, chartQuestionGroup);

                    expect(reportSvc.getStackedPercentageBarChartType).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), {}, jasmine.any(Object));
                    expect(result).toBeDefined();
                });
            });
        });
    });
})();