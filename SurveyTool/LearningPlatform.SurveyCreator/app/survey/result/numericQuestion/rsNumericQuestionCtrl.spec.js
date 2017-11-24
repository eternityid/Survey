(function () {
    'use strict';
    describe('Testing rsNumericQuestionCtrl controller', function () {
        var ctrl,
            scope, q,
            rsNumericQuestionSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $q) {
                q = $q;
                scope = $rootScope.$new();
                scope.aggregatedQuestion = {
                    avg: 2,
                    min: 1,
                    max: 3,
                    sum: 10
                };

                rsNumericQuestionSvc = jasmine.createSpyObj('rsNumericQuestionSvc', ['renderChart', 'renderTable']);
                rsNumericQuestionSvc.renderChart.and.returnValue({});
                rsNumericQuestionSvc.renderTable.and.returnValue({});

                ctrl = $controller('rsNumericQuestionCtrl', {
                    $scope: scope,
                    rsNumericQuestionSvc: rsNumericQuestionSvc
                });
            });
        });

        describe('Testing controller properties', function () {
            it('should define required properties', function () {
                expect(ctrl.chart).toBeDefined();
                expect(ctrl.avgSelections).toBeDefined();
                expect(ctrl.minSelections).toBeDefined();
                expect(ctrl.maxSelections).toBeDefined();
                expect(ctrl.sumSelections).toBeDefined();
            });
        });

        describe('Testing init function', function () {
            it('should render the chart successful', function () {
                ctrl.init();
                scope.$digest();
                expect(ctrl.chart).toEqual({});
                expect(ctrl.avgSelections).toEqual(2);
                expect(ctrl.minSelections).toEqual(1);
                expect(ctrl.maxSelections).toEqual(3);
                expect(ctrl.sumSelections).toEqual(10);
            });
        });
    });
})();