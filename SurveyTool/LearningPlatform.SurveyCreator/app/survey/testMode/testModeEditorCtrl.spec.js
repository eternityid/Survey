(function() {
    describe('Testing testModeEditorCtrl controller', function () {
        var scope, testModeSvc, pushDownSvc, respondentListSvc, respondentListDataSvc, spinnerUtilSvc, respondentDetailDialogDataSvc,
            errorHandlingSvc, timeout, q, ctrl, $modal;

        beforeEach(function() {
            module('svt');
            inject(function ($controller, $rootScope, $q, $timeout) {
                q = $q;
                timeout = $timeout;
                scope = $rootScope.$new();
                scope.testModeSettings = { surveyId: 1, isActive: true };
                scope.$parent = {
                    vm: {}
                };

                testModeSvc = jasmine.createSpyObj('testModeSvc', ['getTestModeSettings']);
                testModeSvc.getTestModeSettings.and.returnValue({isActive: true});

                pushDownSvc = jasmine.createSpyObj('pushDownSvc', ['getPushDownSettings', 'showGenerateRandomData', 'hidePushDown', 'setLoadingStatus']);

                respondentListSvc = jasmine.createSpyObj('respondentListSvc', ['getDefaultPaging', 'populateRespondents']);

                respondentListDataSvc = jasmine.createSpyObj('respondentListDataSvc', ['search', 'deleteRespondents']);
                respondentListDataSvc.search.and.returnValue({ $promise: q.when() });

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError', 'writeErrorToConsole']);
                $modal = jasmine.createSpyObj('$modal', ['open']);

                respondentDetailDialogDataSvc = jasmine.createSpyObj('respondentDetailDialogDataSvc', ['getRespondentDetail']);

                ctrl = $controller('testModeEditorCtrl', {
                    $scope: scope,
                    testModeSvc: testModeSvc,
                    pushDownSvc: pushDownSvc,
                    respondentListSvc: respondentListSvc,
                    respondentListDataSvc: respondentListDataSvc,
                    spinnerUtilSvc: spinnerUtilSvc,
                    errorHandlingSvc: errorHandlingSvc,
                    $modal: $modal,
                    $routeParams: { id: 1 },
                    $timeout: timeout,
                    respondentDetailDialogDataSvc: respondentDetailDialogDataSvc
                });
                scope.$digest();
            });
        });

        describe('Testing showGenerateRandomData function', function () {
            it('should show push down', function () {

                ctrl.showGenerateRandomData();
                scope.$digest();

                expect(pushDownSvc.showGenerateRandomData).toHaveBeenCalled();
            });
        });

        describe('Testing showStartNew function', function () {
            it('should open start new popup', function () {
                $modal.open.and.returnValue({ result: q.when({}) });
                ctrl.showStartNew();
                scope.$digest();

                expect(pushDownSvc.hidePushDown).toHaveBeenCalled();
            });
        });

        describe('Testing showRetakeDialog function', function () {
            it('should open retake popup', function () {
                respondentDetailDialogDataSvc.getRespondentDetail.and.returnValue({ $promise: q.when({ data: { Link: '' } }) });
                $modal.open.and.returnValue({ result: q.when({}) });
                ctrl.showRetakeDialog(1);
                scope.$digest();

                expect($modal.open).toHaveBeenCalled();
            });
            it('should open retake popup', function () {
                respondentDetailDialogDataSvc.getRespondentDetail.and.returnValue({ $promise: q.reject({}) });
                $modal.open.and.returnValue({ result: q.when({}) });
                ctrl.showRetakeDialog(1);
                scope.$digest();

                expect($modal.open).not.toHaveBeenCalled();
            });
        });

        describe('Testing loadMore function', function () {
            it('should handle when load more success', function () {
                respondentListDataSvc.search.and.returnValue({ $promise: q.when({respondents: [] }) });
                ctrl.searchModel = {
                    paging: {}
                };
                ctrl.loadMore();
                scope.$digest();

                expect(respondentListSvc.populateRespondents).toHaveBeenCalled();
            });
            it('should handle when load more fail', function () {
                respondentListDataSvc.search.and.returnValue({ $promise: q.reject({ error: {} }) });
                ctrl.loadMore();
                scope.$digest();
            });
        });

        describe('Testing search function', function () {
            beforeEach(function() {
                ctrl.searchModel = {
                    paging: {}
                };
                ctrl.overlay = {
                    hide: jasmine.createSpy('hide'),
                    show: jasmine.createSpy('show')
                };
            });

            it('should handle when search success', function () {
                respondentListDataSvc.search.and.returnValue({ $promise: q.when({ respondents: [] }) });
                ctrl.searchModel = {
                    paging: {}
                };
                ctrl.search();
                scope.$digest();

                expect(respondentListSvc.populateRespondents).toHaveBeenCalled();
            });
            it('should handle when search fail', function () {
                respondentListDataSvc.search.and.returnValue({ $promise: q.reject('dummy') });

                ctrl.search();
                scope.$digest();

                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });

        describe('Testing handleAfterGenerateRandomData function', function () {
            beforeEach(function () {
                ctrl.searchModel = {
                    paging: {}
                };
                ctrl.overlay = {
                    hide: jasmine.createSpy('hide'),
                    show: jasmine.createSpy('show')
                };
            });

            it('should handle when handleAfterGenerateRandomData success', function () {
                respondentListDataSvc.search.and.returnValue({ $promise: q.when({ respondents: [] }) });
                ctrl.searchModel = {
                    paging: {}
                };
                ctrl.handleAfterGenerateRandomData();
                scope.$digest();

                expect(respondentListSvc.populateRespondents).toHaveBeenCalled();
            });
        });

        describe('Testing changeRespondentMasterCheckbox function', function () {
            it('should handle when changeRespondentMasterCheckbox with checked value', function () {
                ctrl.master = true;
                ctrl.respondents = [{ id: 0, isSelected: false }];
                ctrl.changeRespondentMasterCheckbox();
                scope.$digest();

                expect(ctrl.removableRespondentIds).toEqual([]);
            });
            it('should handle when changeRespondentMasterCheckbox with unchecked value', function () {
                ctrl.master = false;
                ctrl.respondents = [{ id: 0, isSelected: true }];
                ctrl.changeRespondentMasterCheckbox();
                scope.$digest();

                expect(ctrl.removableRespondentIds).toEqual([]);
            });
        });

        describe('Testing changeRespondentCheckboxValue function', function () {
            it('should handle when uncheck a checkbox', function () {
                ctrl.master = true;
                ctrl.removableRespondentIds= [0];
                ctrl.respondents = [{}];
                ctrl.changeRespondentCheckboxValue(0);
                scope.$digest();

                expect(ctrl.removableRespondentIds.length).toEqual(0);
            });
            it('should handle when check a checkbox', function () {
                ctrl.master = false;
                ctrl.removableRespondentIds = [0];
                ctrl.changeRespondentCheckboxValue(1);
                scope.$digest();

                expect(ctrl.removableRespondentIds.length).toEqual(2);
            });

            it('should handle when check all checkboxs in screen', function () {
                ctrl.master = false;
                ctrl.removableRespondentIds = [];
                ctrl.respondents = [{}];
                ctrl.changeRespondentCheckboxValue(1);
                scope.$digest();

                expect(ctrl.removableRespondentIds.length).toEqual(1);
            });
        });

        describe('Testing deleteRespondents function', function () {
            it('should handle when delete respondents successfully', function () {
                $modal.open.and.returnValue({ result: q.when({ status: true }) });
                respondentListDataSvc.deleteRespondents.and.returnValue({ $promise: q.when() });
                ctrl.deleteRespondents();
                scope.$digest();

                expect(respondentListDataSvc.deleteRespondents).toHaveBeenCalled();
            });
            it('should handle when delete respondents unsuccessfully', function () {
                spyOn(toastr, 'error');
                $modal.open.and.returnValue({ result: q.when({ status: true }) });
                respondentListDataSvc.deleteRespondents.and.returnValue({ $promise: q.reject({data:''}) });
                ctrl.deleteRespondents();
                scope.$digest();

                expect(respondentListDataSvc.deleteRespondents).toHaveBeenCalled();
                expect(toastr.error).toHaveBeenCalled();
            });

            it('should handle when clicking No button on Confirmation dialog', function () {
                $modal.open.and.returnValue({ result: q.when({ status: false }) });
                ctrl.deleteRespondents();
                scope.$digest();

                expect(respondentListDataSvc.deleteRespondents).not.toHaveBeenCalled();
            });
        });
    });
})();