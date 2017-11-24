(function () {
    describe('Testing rsChartApplicableQuestionsCtrl controller', function () {
        var ctrl,
            spinnerUtilSvc,
            scope,
            q,
            reportDataSvc,
            reportSvc,
            rsChartApplicableQuestionsSvc,
            errorHandlingSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $q) {
                q = $q;
                scope = $rootScope.$new();
                scope.chartQuestionGroup = 0;
                scope.aggregatedQuestion = {
                    questionType: 9,
                    questionSetting: {
                        chartType: 'stacked_bar',
                        displaySummaryTabular: true
                    },
                    numberOfRespondents: 1,
                    numberOfResponses: 1
                };

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                reportSvc = jasmine.createSpyObj('reportSvc', [
                    'getChartTypes', 'checkEmptyPieChart', 'getQuestionSetting'
                ]);
                reportSvc.getChartTypes.and.returnValue([{}]);
                reportSvc.checkEmptyPieChart.and.returnValue(false);
                reportSvc.getQuestionSetting.and.returnValue({ surveyId: 1 });

                reportDataSvc = jasmine.createSpyObj('reportDataSvc', ['updateQuestionViewChart']);
                reportDataSvc.updateQuestionViewChart.and.returnValue({ $promise: q.when({}) });

                rsChartApplicableQuestionsSvc = jasmine.createSpyObj('rsChartApplicableQuestionsSvc', [
                    'renderTable', 'buildChartData', 'renderChart'
                ]);
                rsChartApplicableQuestionsSvc.renderTable.and.returnValue({});
                rsChartApplicableQuestionsSvc.renderChart.and.returnValue({});

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', [
                    'manifestError'
                ]);

                ctrl = $controller('rsChartApplicableQuestionsCtrl', {
                    $scope: scope,
                    spinnerUtilSvc: spinnerUtilSvc,
                    reportSvc: reportSvc,
                    reportDataSvc: reportDataSvc,
                    rsChartApplicableQuestionsSvc: rsChartApplicableQuestionsSvc,
                    errorHandlingSvc: errorHandlingSvc
                });
            });
        });

        describe('Testing controller properties', function () {
            it('should define required properties', function () {
                expect(ctrl.chartQuestionGroup).toBeDefined();
                expect(ctrl.chartQuestionGroups).toBeDefined();
                expect(ctrl.chartTypes).toBeDefined();
                expect(ctrl.selectedChartType).toBeDefined();
                expect(ctrl.isDisplaySummaryTabular).toBeDefined();
                expect(ctrl.totalRespondents).toBeDefined();
                expect(ctrl.totalResponses).toBeDefined();
                expect(ctrl.isEmptyPieChart).toBeDefined();
                expect(ctrl.table).toBeDefined();
                expect(ctrl.chart).toBeDefined();
            });
        });

        describe('Testing init function', function () {
            describe('Testing reloadChart function', function() {
                it('should set NPS for Net Promoter Score question type', function () {
                    ctrl.NPS = undefined;
                    rsChartApplicableQuestionsSvc.buildChartData.and.returnValue({ nps: 'dummy' });
                    scope.aggregatedQuestion.questionType = 6;

                    ctrl.init();
                });
            });
        });

        describe('Testing changeChartType function', function () {
            var chartType = 'area';

            it('should change the chart type of scope when updating chart type was successful', function () {
                scope.aggregatedQuestion.questionSetting.chartType = 'line';

                ctrl.changeChartType(chartType);
                scope.$digest();

                expect(scope.aggregatedQuestion.questionSetting.chartType).toEqual('area');
            });

            it('should process error when updating chart type was not successful', function () {
                reportDataSvc.updateQuestionViewChart.and.returnValue({ $promise: q.reject() });

                ctrl.changeChartType(chartType);
                scope.$digest();

                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });
    });
})();