(function () {
    'use strict';
    describe('Testing surveyDashboardSvc service', function () {
        var surveyDashboardSvc;

        beforeEach(function () {
            module('svt');
            inject(function($injector) {
                surveyDashboardSvc = $injector.get('surveyDashboardSvc');
            });
        });

        describe('Testing renderResponsesStatus function', function () {
            var dashboardData, result;

            it('should return default data with null dashboard data', function() {
                dashboardData = null;

                result = surveyDashboardSvc.renderResponsesStatus(dashboardData);

                expect(result.maxDataLength).toEqual(2);
                expect(result.total.value).toEqual(0);
            });

            it('should return responsesStatus', function() {
                dashboardData = { total: 10, dropoutRate: 20, started: 4, inProgress: 2, completed: 6 };

                result = surveyDashboardSvc.renderResponsesStatus(dashboardData);

                expect(result.maxDataLength).toBeDefined(3);
                expect(result.total.value).toBeGreaterThan(0);
            });
        });

        describe('Testing renderBarChart function', function () {
            var dashboardData, result;

            it('should return barChart', function() {
                dashboardData = { total: 2, started: 1, completed: 1 };

                result = surveyDashboardSvc.renderBarChart(dashboardData);

                expect(result.series[0].data[0]).toBeGreaterThan(0);
            });

            it('should render bar chart with null dashboard data', function() {
                dashboardData = null;

                result = surveyDashboardSvc.renderBarChart(dashboardData);

                expect(result.series[0].data[0]).toEqual(0);
            });
        });

        describe('Testing renderLineChart function', function () {
            var dashboardData, result;

            it('should return lineChart', function() {
                dashboardData = {
                    trend: {
                        points: [
                            {
                                at: "2015-05-05",
                                started: 1,
                                completed: 1
                            }
                        ],
                        from: "2015-05-05",
                        to: "2015-05-07"
                    }
                };

                result = surveyDashboardSvc.renderLineChart(dashboardData);

                expect(result.yAxis.max).not.toBeDefined();
            });

            it('should return lineChart with wrong points', function() {
                dashboardData = {
                    trend: {
                        points: {},
                        from: "2015-05-05",
                        to: "2015-05-07"
                    }
                };

                result = surveyDashboardSvc.renderLineChart(dashboardData);

                expect(result.yAxis.max).toEqual(1);
            });

            it('should return empty lineChart when dashboard data is empty', function() {
                dashboardData = null;

                result = surveyDashboardSvc.renderLineChart(dashboardData);

                expect(result).toBeDefined();
            });
        });

    });
})();