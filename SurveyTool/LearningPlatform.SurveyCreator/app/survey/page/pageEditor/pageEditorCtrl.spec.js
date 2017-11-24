(function () {
    'use strict';
    describe('Testing pageEditorCtrl controller', function () {
        var ctrl, scope, q, settingConst, errorHandlingSvc, surveyEditorSvc,
            pageSvc, pageDataSvc, questionSvc, surveyEditorPageSvc, spinnerUtilSvc, indexSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $q, $injector) {
                q = $q;
                scope = $rootScope.$new();
                scope.pageObj = {};
                scope.navigationButtonSettings = {};
                scope.questionOrders = {};

                settingConst = $injector.get('settingConst');

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError']);

                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', [
                    'setSurveyEditMode', 'setPageEditorId']);

                pageSvc = jasmine.createSpyObj('pageSvc', ['setActivePage', 'showMovingPageIcon']);

                pageDataSvc = jasmine.createSpyObj('pageDataSvc', ['updatePage']);

                questionSvc = jasmine.createSpyObj('questionSvc', ['setActiveQuestion']);

                surveyEditorPageSvc = jasmine.createSpyObj('surveyEditorPageSvc', ['updatePageSettings']);

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['hideSpinner', 'showSpinner']);

                indexSvc = jasmine.createSpyObj('indexSvc', ['callbackCheckOverlay']);

                ctrl = $controller('pageEditorCtrl', {
                    $scope: scope,
                    settingConst: settingConst,
                    errorHandlingSvc: errorHandlingSvc,
                    surveyEditorSvc: surveyEditorSvc,
                    pageSvc: pageSvc,
                    pageDataSvc: pageDataSvc,
                    questionSvc: questionSvc,
                    surveyEditorPageSvc: surveyEditorPageSvc,
                    spinnerUtilSvc: spinnerUtilSvc,
                    indexSvc: indexSvc
                });
            });
        });

        describe('Testing init function', function () {
            it('should setup properties for controller', function () {
                ctrl.init();
                expect(ctrl.navigationButtonSettings).toBeDefined();
                expect(ctrl.questionOrders).toBeDefined();
                expect(ctrl.page).toBeDefined();
            });
        });

        describe('Testing updatePage function', function () {
            it('should handle when update page fail', function () {
                pageDataSvc.updatePage.and.returnValue({ $promise: q.reject({}) });

                ctrl.save();
                scope.$digest();
            });

            it('should handle error when page was changed before saving', function () {
                pageDataSvc.updatePage.and.returnValue({ $promise: q.reject({ status: 412 }) });

                ctrl.save();
                scope.$digest();
            });

            it('should handle when update page success', function () {
                spyOn(toastr, 'error');
                pageDataSvc.updatePage.and.returnValue({ $promise: q.when({}) });

                ctrl.save();
                scope.$digest();
            });
        });

        describe('Testing close function', function () {
            it('should close pageEditor', function () {
                ctrl.close();

                expect(surveyEditorSvc.setPageEditorId).toHaveBeenCalled();
                expect(pageSvc.setActivePage).toHaveBeenCalled();
                expect(questionSvc.setActiveQuestion).toHaveBeenCalled();
            });
        });

    });
})();