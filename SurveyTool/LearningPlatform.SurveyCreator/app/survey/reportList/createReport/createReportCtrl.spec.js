(function() {
    describe('Testing createReportCtrl controller', function () {
        var scope, errorHandlingSvc, pushDownSvc, reportListSvc, surveyDataSvc, createReportSvc, spinnerUtilSvc,
            reportListDataSvc, q, ctrl;

        beforeEach(function() {
            module('svt');
            inject(function ($controller, $rootScope, $q) {
                q = $q;
                scope = $rootScope.$new();
                scope.handleAfterSave = jasmine.createSpy();
                scope.editor = { report: {} };

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError']);
                pushDownSvc = jasmine.createSpyObj('pushDownSvc', ['hidePushDown', 'setLoadingStatus']);
                reportListSvc = jasmine.createSpyObj('reportListSvc', [
                    'spinnerShow', 'spinnerHide'
                ]);

                surveyDataSvc = jasmine.createSpyObj('surveyDataSvc', ['getSurveyList']);
                surveyDataSvc.getSurveyList.and.returnValue({ $promise: q.when([{ id: 'dummy', name: 'dummy' }]) });

                createReportSvc = jasmine.createSpyObj('createReportSvc', [
                    'validate', 'getPlaceHolders', 'mapSurveys'
                ]);
                createReportSvc.getPlaceHolders.and.returnValue({});

                reportListDataSvc = jasmine.createSpyObj('reportListDataSvc', ['addReport', 'editReport']);

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                ctrl = $controller('createReportCtrl', {
                    $scope: scope,
                    errorHandlingSvc: errorHandlingSvc,
                    pushDownSvc: pushDownSvc,
                    reportListSvc: reportListSvc,
                    surveyDataSvc: surveyDataSvc,
                    createReportSvc: createReportSvc,
                    reportListDataSvc: reportListDataSvc,
                    spinnerUtilSvc: spinnerUtilSvc
                });
                scope.$digest();
            });
        });

        describe('Testing loadSurveys function', function () {
            it('should process error when loading surveys has problem', function () {
                surveyDataSvc.getSurveyList.and.returnValue({ $promise: q.reject() });

                ctrl.loadSurveys();
                scope.$digest();

                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });

        describe('Testing save function', function () {
            it('should not add new report with invalid data', function () {
                createReportSvc.validate.and.returnValue(false);

                ctrl.save();

                expect(reportListDataSvc.addReport).not.toHaveBeenCalled();
            });

            describe('Testing addNewReport function', function () {
                beforeEach(function() {
                    createReportSvc.validate.and.returnValue(true);
                    ctrl.editor.isAdd = true;
                });

                it('should show success message when adding new report was successful', function () {
                    reportListDataSvc.addReport.and.returnValue({ $promise: q.when({ status: true }) });

                    ctrl.save();
                    scope.$digest();

                    expect(pushDownSvc.hidePushDown).toHaveBeenCalled();
                });

                it('should process error when adding new report has problem', function () {
                    reportListDataSvc.addReport.and.returnValue({ $promise: q.reject() });

                    ctrl.save();
                    scope.$digest();

                    expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
                });
            });

            describe('Testing editReport function', function () {
                beforeEach(function() {
                    createReportSvc.validate.and.returnValue(true);
                    ctrl.editor.isAdd = false;
                });

                it('should hide pushDown when editing report was successful', function () {
                    spyOn(toastr, 'success');
                    reportListDataSvc.editReport.and.returnValue({ $promise: q.when({}) });

                    ctrl.save();
                    scope.$digest();

                    expect(pushDownSvc.hidePushDown).toHaveBeenCalled();
                });

                it('should process error message when editing report was not successful', function () {
                    reportListDataSvc.editReport.and.returnValue({ $promise: q.reject({}) });

                    ctrl.save();
                    scope.$digest();

                    expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
                });
            });
        });
    });
})();