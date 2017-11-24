(function () {
    'use stric';
    describe('Testing reportPageCtrl controller', function () {
        var ctrl, scope, state = 0, q,
            $modal, reportPageSvc,
            constantSvc,
            spinnerUtilSvc, errorHandlingSvc,
            settingConst, reportSvc,
            rpSelectionQuestionSvc, reportEditorSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $injector, $q) {
                q = $q;
                scope = $rootScope.$new();
                scope.pageIndex = 1;
                scope.questions = [{
                    Type: 'dummy',
                    id: 1,
                    name: 'dummy'
                }];
                scope.pageObj = { reportElementDefinitions: [] };
                $modal = jasmine.createSpyObj('$modal', ['open']);
                $modal.open.and.returnValue({ result: q.when({ status: true }) });

                reportPageSvc = jasmine.createSpyObj('reportPageSvc', [
                    'getEditingElement', 'getWorkingElementIds', 'loadTableByQuestion', 'loadChartByQuestion',
                    'addPage', 'addPageToCurrentPages', 'setActivePageIndex', 'deletePageFromCurrentPages',
                    'setEditingElementId', 'setActivePageIndex', 'getActivePage', 'getCurrentPages',
                    'getCollapsedPageIds', 'getRequiredValidation', 'getAvailableQuestionsForChartElement', 'getAvailableQuestionsForTableElement',
                    'loadDataForReportElementsInPage'
                ]);
                reportPageSvc.getCurrentPages.and.callFake(function () {
                    if (state === 0) return {
                        data: [{}, { reportElementDefinitions: [{ $type: 'ReportChartElement' }] }]
                    }; else if (state === 1) return {
                        data: [{}, { reportElementDefinitions: [{ $type: 'ReportTableElement' }] }]
                    }; else  return {
                        data: [{}, { reportElementDefinitions: [{ $type: 'ReportTextElement' }] }]
                    };

                });

                reportPageSvc.getActivePage.and.returnValue({ index: 0 });

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);
                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError']);
                reportSvc = jasmine.createSpyObj('reportSvc', [
                    'getSeriesForGrid', 'getSeries', 'getStackedColumnChartType', 'getStackedPercentageColumnChartType',
                    'getStackedBarChartType', 'getStackedPercentageBarChartType', 'getLineChartType',
                    'getAreaChartType', 'getStackedAreaChartType']);
                rpSelectionQuestionSvc = jasmine.createSpyObj('rpSelectionQuestionSvc', ['renderChart']);
                constantSvc = $injector.get('constantSvc');
                settingConst = $injector.get('settingConst');

                reportEditorSvc = jasmine.createSpyObj('reportEditorSvc', ['getReportData', 'isNoData', 'getShowedMarginPage', 'setWorkingScreenOnPage']);
                reportEditorSvc.getReportData.and.returnValue({
                    questions: [{}]
                });
                reportEditorSvc.isNoData.and.returnValue({});

                ctrl = $controller('reportPageCtrl', {
                    $scope: scope,
                    $modal: $modal,
                    reportPageSvc: reportPageSvc,
                    constantSvc: constantSvc,
                    spinnerUtilSvc: spinnerUtilSvc,
                    errorHandlingSvc: errorHandlingSvc,
                    settingConst: settingConst,
                    reportSvc: reportSvc,
                    rpSelectionQuestionSvc: rpSelectionQuestionSvc,
                    reportEditorSvc: reportEditorSvc
                });
                            });
        });

        describe('Testing reportPageCtrl controller properties', function () {
            it('should define required properties', function () {
                state = 1;
                ctrl.init();
            });
        });

        describe('Testing init function', function () {
            it('should  init the menu path', function () {
                state = 2;
                ctrl.init();
            });
        });

        describe('Testing onAddChart function', function () {
            it('should onAddChart menu item by name', function () {
                ctrl.onAddChart();
            });
        });
    });
})();