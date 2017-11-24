(function () {
    'use strict';
    describe('Testing respondentListCtrl controller', function () {
        var respondentListCtrl,
            scope,
            routeParams,
            respondentListDataSvc,
            spinnerUtilSvc,
            q,
            modal,
            errorHandlingSvc,
            respondentListSvc,
            pushDownSvc,
            testModeSvc,
            surveyEditorSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $q, $injector) {
                scope = $rootScope.$new();
                scope.$parent = {
                    vm: {}
                };
                routeParams = { id: '123' };
                q = $q;
                respondentListDataSvc = jasmine.createSpyObj('respondentListDataSvc', ['search', 'deleteRespondents']);
                respondentListDataSvc.search.and.returnValue({ $promise: q.when([{ id: 1, email: 'abc@yahoo.com' }]) });

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);
                modal = jasmine.createSpyObj('modal', ['open']);
                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError', 'writeErrorToConsole']);
                respondentListSvc = jasmine.createSpyObj('respondentListSvc', [
                    'getDefaultSearchModel', 'validateSearch', 'getDefaultPaging', 'populateRespondents',
                    'validateShowingEmailEditor',
                    'validateNumberSentFieldWhenTyping'
                ]);
                respondentListSvc.getDefaultSearchModel.and.returnValue({
                    numberSent: {},
                    lastTimeSent: {},
                    completedTimeSent: {},
                    paging: {}
                });
                respondentListSvc.getDefaultPaging.and.returnValue({});

                pushDownSvc = jasmine.createSpyObj('pushDownSvc', [
                    'getPushDownSettings', 'showImportRespondent', 'hidePushDown', 'setLoadingStatus', 'showEmailRespondent', 'showExportResponses'
                ]);

                testModeSvc = jasmine.createSpyObj('testModeSvc', ['getTestModeSettings']);
                testModeSvc.getTestModeSettings.and.returnValue({});

                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', ['getCurrentSurveyInfo']);
                surveyEditorSvc.getCurrentSurveyInfo.and.returnValue({});

                spyOn(angular, 'element').and.returnValue({
                    datepicker: jasmine.createSpy(),
                    keypress: jasmine.createSpy(),
                    hide: jasmine.createSpy(),
                    show: jasmine.createSpy(),
                    off: jasmine.createSpy(),
                    prop: jasmine.createSpy()
                });

                respondentListCtrl = $controller('respondentListCtrl', {
                    $scope: scope,
                    $routeParams: routeParams,
                    respondentListDataSvc: respondentListDataSvc,
                    spinnerUtilSvc: spinnerUtilSvc,
                    $modal: modal,
                    errorHandlingSvc: errorHandlingSvc,
                    respondentListSvc: respondentListSvc,
                    pushDownSvc: pushDownSvc,
                    testModeSvc: testModeSvc,
                    surveyEditorSvc: surveyEditorSvc
                });
                scope.$digest();
            });
        });

        describe('Testing controller properties', function () {
            it('should define required properties', function () {
                expect(respondentListCtrl.respondentsFound).toBeDefined();
                expect(respondentListCtrl.searchModel).toBeDefined();
                expect(respondentListCtrl.respondents).toBeDefined();
            });
        });

        describe('Testing searchPanelOnKeyPress function', function() {
            var event = {};

            beforeEach(function() {
                spyOn(respondentListCtrl, 'search');
            });

            it('should search respondents when pressing enter key', function () {
                event.which = 13;
                event.preventDefault = jasmine.createSpy();

                respondentListCtrl.searchPanelOnKeyPress(event);

                expect(respondentListCtrl.search).toHaveBeenCalled();
            });

            it('should not search respondents when no pressing enter key', function () {
                event.which = 10;

                respondentListCtrl.searchPanelOnKeyPress(event);

                expect(respondentListCtrl.search).not.toHaveBeenCalled();
            });
        });

        describe('Testing showUploadRespondent function', function () {
            beforeEach(function() {
                spyOn(respondentListCtrl, 'search');
            });

            it('should show Upload Respondent form and search data', function () {
                respondentListCtrl.showUploadRespondent();
                scope.$digest();

                expect(pushDownSvc.showImportRespondent).toHaveBeenCalled();
            });

            it('should not search data when closing dialog', function() {
                modal.open.and.returnValue({ result: q.when({ status: false }) });

                respondentListCtrl.showUploadRespondent();
                scope.$digest();

                expect(respondentListCtrl.search).not.toHaveBeenCalled();
            });
        });

        describe('Testing search function', function () {
            beforeEach(function() {
                respondentListCtrl.isSpinnerActive = false;
                respondentListSvc.validateSearch.and.returnValue(true);
            });

            it('should update search result when searching respondents has no problem', function () {
                respondentListDataSvc.search.and.returnValue({ $promise: q.when({ respondents: [{ id: 1 }, { id: 2 }] }) });
                respondentListCtrl.respondentsFound = 1;
                respondentListCtrl.respondents.data = [{ id: 1 }];
                respondentListSvc.populateRespondents.and.returnValue({ data: [] });

                respondentListCtrl.search();

                expect(respondentListSvc.validateSearch).toHaveBeenCalled();
                expect(respondentListSvc.getDefaultPaging).toHaveBeenCalled();
                scope.$digest();

                expect(respondentListDataSvc.search).toHaveBeenCalled();
                expect(respondentListSvc.populateRespondents).toHaveBeenCalled();
            });

            it('should process error when searching respondents has problem', function () {
                respondentListDataSvc.search.and.callFake(function() {
                    var defer = q.defer();
                    defer.reject({});
                    return {
                        $promise: defer.promise
                    };
                });
                respondentListCtrl.search();
                scope.$digest();

                expect(respondentListDataSvc.search).toHaveBeenCalled();
                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });

        describe('Testing loadMore function', function () {
            it('should update surveys data when loading more surveys has no problem', function () {
                respondentListDataSvc.search.and.returnValue({ $promise: q.when({ dummy: 'dummy', respondents: [] }) });

                respondentListCtrl.loadMore();
                scope.$digest();

                expect(respondentListDataSvc.search).toHaveBeenCalled();
                expect(respondentListSvc.populateRespondents).toHaveBeenCalled();
            });

            it('should process error when loading more surveys has problem', function () {
                respondentListDataSvc.search.and.callFake(function() {
                    var defer = q.defer();
                    defer.reject({});
                    return {
                        $promise: defer.promise
                    };
                });

                respondentListCtrl.loadMore();
                scope.$digest();

                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });

        describe('Testing showEmailEditor function', function() {
            it('should not open popup with invalid data', function () {
                respondentListSvc.validateShowingEmailEditor.and.returnValue(false);

                respondentListCtrl.showEmailEditor();

                expect(pushDownSvc.showEmailRespondent).not.toHaveBeenCalled();
            });

            it('should open popup with valid data', function() {
                respondentListSvc.validateShowingEmailEditor.and.returnValue(true);

                respondentListCtrl.showEmailEditor();
                scope.$digest();

                expect(pushDownSvc.showEmailRespondent).toHaveBeenCalled();
            });
                    });

        describe('Testing showExportResponses function', function() {
            it('should show dialog', function () {
                respondentListCtrl.showExportResponses();

                expect(pushDownSvc.showExportResponses).toHaveBeenCalled();
            });
        });

        describe('Testing showRespondentDetail function', function () {
            it('should show dialog', function () {
                respondentListCtrl.showRespondentDetail();

                expect(modal.open).toHaveBeenCalledWith(jasmine.objectContaining({
                    templateUrl: 'survey/respondentDetail/respondent-detail.html'
                }));
            });
        });

        describe('Testing changeRespondentMasterCheckbox function', function () {
            it('should check detailed checkbox when checking master checkbox', function () {
                respondentListCtrl.masterCheckboxStatus = true;
                respondentListCtrl.respondents = [{ id: 1 }, { id: 2 }];

                respondentListCtrl.changeRespondentMasterCheckbox();

                expect(respondentListCtrl.removableRespondentIds.length).toBeGreaterThan(0);
                expect(respondentListCtrl.respondents[0].isSelected).toEqual(true);
            });

            it('should uncheck all detail checkboxes when unchecking master checkbox', function () {
                respondentListCtrl.masterCheckboxStatus = false;
                respondentListCtrl.respondents = [{ id: 1, isSelected: true }, { id: 2 }];

                respondentListCtrl.changeRespondentMasterCheckbox();

                expect(respondentListCtrl.respondents[0].isSelected).toEqual(false);
            });
        });

        describe('Testing checkboxChange function', function () {
            it('should handle when uncheck a checkbox', function () {
                respondentListCtrl.master = true;
                respondentListCtrl. removableRespondentIds= [0];
                respondentListCtrl.respondents = [{}];
                respondentListCtrl.changeRespondentCheckboxValue(0);
                scope.$digest();

                expect(respondentListCtrl.removableRespondentIds.length).toEqual(0);
            });
            it('should handle when check a checkbox', function () {
                respondentListCtrl.master = false;
                respondentListCtrl.removableRespondentIds= [0];
                respondentListCtrl.changeRespondentCheckboxValue(1);
                scope.$digest();

                expect(respondentListCtrl.removableRespondentIds.length).toEqual(2);
            });

            it('should handle when check all checkboxs in screen', function () {
                respondentListCtrl.master = false;
                respondentListCtrl.removableRespondentIds = [];
                respondentListCtrl.respondents = [{}];
                respondentListCtrl.changeRespondentCheckboxValue(1);
                scope.$digest();

                expect(respondentListCtrl.removableRespondentIds.length).toEqual(1);
            });
        });

        describe('Testing deleteRespondents function', function () {
            it('should handle when delete respondents successfully', function () {
                modal.open.and.returnValue({ result: q.when({ status: true }) });
                respondentListDataSvc.deleteRespondents.and.returnValue({ $promise: q.when() });
                respondentListCtrl.deleteRespondents();
                scope.$digest();

                expect(respondentListDataSvc.deleteRespondents).toHaveBeenCalled();
            });
            it('should handle when delete respondents unsuccessfully', function () {
                spyOn(toastr, 'error');
                modal.open.and.returnValue({ result: q.when({ status: true }) });
                respondentListDataSvc.deleteRespondents.and.returnValue({ $promise: q.reject({ data: '' }) });
                respondentListCtrl.deleteRespondents();
                scope.$digest();

                expect(respondentListDataSvc.deleteRespondents).toHaveBeenCalled();
                expect(toastr.error).toHaveBeenCalled();
            });

            it('should handle when clicking No button on Confirmation dialog', function () {
                modal.open.and.returnValue({ result: q.when({ status: false }) });
                respondentListCtrl.deleteRespondents();
                scope.$digest();

                expect(respondentListDataSvc.deleteRespondents).not.toHaveBeenCalled();
            });
        });
    });
})();