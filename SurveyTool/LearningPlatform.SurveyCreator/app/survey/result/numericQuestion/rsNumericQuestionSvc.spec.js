(function () {
    'use strict';
    describe('Testing rsNumericQuestionSvc service', function () {
        var rsNumericQuestionSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                rsNumericQuestionSvc = $injector.get('rsNumericQuestionSvc');
            });
        });

        describe('Testing renderChart function', function () {
            it('should return the right chart', function () {
                var aggregatedQuestionMock = {
                    answers: [
                        { optionText: 'A', count: 1 },
                        { optionText: 'B', count: 2 },
                        { optionText: 'C', count: 3 },
                        { optionText: 'D', count: 4 },
                        { optionText: 'E', count: 5 }
                    ]
                };
                var expectedCategories = ['A', 'B', 'C', 'D', 'E'];
                var expectedSeries = [{ name: 'A', y: 1, color: '#AA4643' }, { name: 'B', y: 2, color: '#89A54E' }, { name: 'C', y: 3, color: '#80699B' }, { name: 'D', y: 4, color: '#3D96AE' }, { name: 'E', y: 5, color: '#DB843D' }];
                var result = rsNumericQuestionSvc.renderChart(aggregatedQuestionMock);
                expect(result.series[0].data).toEqual(expectedSeries);
                expect(result.xAxis.categories).toEqual(expectedCategories);
            });
        });

    });
})();