(function () {
    describe('Testing elementDialogCtrl controller', function () {
        var ctrl, modalInstance,
            reportPageSvc, elementDialogSvc,
            scope, reportEditorSvc,
            spinnerUtilSvc, errorHandlingSvc,
            arrayUtilSvc, reportPageDataSvc,
            editor, scopedata, q, reportElementDataSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($controller, $rootScope, $q) {
                q = $q;
                scope = $rootScope.$new();
                scope.elementTypes = {};
                scope.requiredValidation = {};

                scopedata = { chart: 'chart' };

                editor = {
                    isAdd: false,
                    elementType: 'chart',
                    element: { questionId: true, chartType: true }
                };
                modalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss']);

                reportPageSvc = jasmine.createSpyObj('reportPageSvc', [
                    'getRequiredValidation', 'setActivePageIndex', 'setEditingElementId']);
                reportPageSvc.getRequiredValidation.and.returnValue({
                    chart: { valid: false },
                    question: { valid: true }
                });

                reportPageDataSvc = jasmine.createSpyObj('reportPageDataSvc', ['getAllByReportId']);
                reportPageDataSvc.getAllByReportId.and.returnValue({ $promise: q.when({}) });

                elementDialogSvc = jasmine.createSpyObj('elementDialogSvc', [
                    'getQuestionType', 'filterChartTypes', 'getReportElementTypeName',
                    'setupNewReportElementForCreating', 'setupReportElementForEditing'
                ]);

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError']);

                arrayUtilSvc = jasmine.createSpyObj('arrayUtilSvc', ['getItem']);

                reportEditorSvc = jasmine.createSpyObj('reportEditorSvc', ['getElementTypes', 'getReportData']);
                reportEditorSvc.getReportData.and.returnValue({ questions: [] });
                reportEditorSvc.getElementTypes.and.returnValue(scopedata);

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                reportElementDataSvc = jasmine.createSpyObj('reportElementDataSvc', [
                    'addReportElement', 'updateReportElement']);

                ctrl = $controller('elementDialogCtrl', {
                    $scope: scope,
                    reportPageSvc: reportPageSvc,
                    elementDialogSvc: elementDialogSvc,
                    arrayUtilSvc: arrayUtilSvc,
                    reportEditorSvc: reportEditorSvc,
                    errorHandlingSvc: errorHandlingSvc,
                    reportPageDataSvc: reportPageDataSvc,
                    spinnerUtilSvc: spinnerUtilSvc,
                    $modalInstance: modalInstance,
                    editor: editor,
                    reportElementDataSvc: reportElementDataSvc
                });
                scope.$digest();
            });
        });

        describe('Testing init function', function () {
            it('should return default value when page is defined', function () {
                scope.editor.isAdd = true;
                scope.editor.element = undefined;
                scope.editor.elementType = 'table';
                ctrl.init();
                scope.$digest();
            });
        });
        describe('Testing scope.cancel function', function () {
            it('should reset all data', function () {
                scope.cancel();
                expect(reportPageSvc.setActivePageIndex).toHaveBeenCalled();
                expect(reportPageSvc.setEditingElementId).toHaveBeenCalled();
            });
        });

        describe('Testing scope.save function', function () {
            var reportElement;
            beforeEach(function () {
                reportElement = {
                    $type: 'dummy',
                    id: 7,
                    reportPageDefinitionId: {},
                    reportId: 1,
                    chartType: '',
                    chartTypeString: '',
                    displaySummaryTabular: '',
                    questionAlias: '',
                    position: 1,
                    size: '',
                    text: ''
                };

            });
            describe('Testing scope.cancel function', function () {
                it('should return true when page is defined', function () {
                    reportElementDataSvc.updateReportElement.and.returnValue({ $promise: q.when(reportElement) });
                    scope.save();
                    scope.$digest();
                    expect(reportElementDataSvc.updateReportElement).toHaveBeenCalled();
                });

                it('should return false when update report Element not sucessfully', function () {
                    reportElementDataSvc.updateReportElement.and.returnValue({ $promise: q.reject() });
                    scope.save();
                    scope.$digest();
                    expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
                });
            });
            describe('Testing scope.cancel function', function () {
                beforeEach(function () {
                    scope.editor.isAdd = true;
                    scope.editor.page = {
                        data: {
                            reportId: '',
                            id: '',
                            position: ''
                        }
                    };
                });
                it('should return false when page is null', function () {
                    reportElementDataSvc.addReportElement.and.returnValue({ $promise: q.when(reportElement) });
                    scope.save();
                    scope.$digest();
                    expect(reportElementDataSvc.addReportElement).toHaveBeenCalled();
                });
                it('should return false when page is null', function () {
                    reportElementDataSvc.addReportElement.and.returnValue({ $promise: q.reject() });
                    scope.save();
                    scope.$digest();
                    expect(errorHandlingSvc.manifestError).toHaveBeenCalled();

                });
            });
        });
    });
})();