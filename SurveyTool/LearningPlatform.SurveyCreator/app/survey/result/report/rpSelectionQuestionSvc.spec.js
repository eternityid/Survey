(function () {
    'use strict';
    describe('Testing rpSelectionQuestionSvc service', function () {
        var svc,
            reportSvc,
            settingConst;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                reportSvc = jasmine.createSpyObj('reportSvc', [
                    'getSeriesForNetPromoter', 'getSeriesForLikert', 'getSelectionChartType'
                ]);

                $provide.value('reportSvc', reportSvc);
            });

            inject(function ($injector) {
                svc = $injector.get('rpSelectionQuestionSvc');
                settingConst = $injector.get('settingConst');
            });
        });

        describe('Testing renderChart function', function () {
            it('should return the right chart', function () {
                var aggregatedQuestionMock = {
                    answers: [
                        { optionText: 'A', count: 1 },
                        { optionText: 'B', count: 2 }
                    ],
                    questionType: 2,
                    questionSetting: {
                        chartType: 'bar'
                    }
                };
                reportSvc.getSeriesForLikert.and.returnValue({});
                reportSvc.getSelectionChartType.and.returnValue({});

                var result = svc.renderChart(aggregatedQuestionMock);

                expect(reportSvc.getSeriesForLikert).toHaveBeenCalled();
                expect(reportSvc.getSelectionChartType).toHaveBeenCalled();
            });
        });

    });
})();