(function () {
    'use strict';
    describe('Testing skipCommandEditorCtrl controller', function () {
        var ctrl, scope, q, skipCommandEditorSvc, surveyEditorSvc, constantSvc, modal,
            surveyEditorPageSvc, pageSvc, pageDataSvc, errorHandlingSvc, questionSvc, spinnerUtilSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $q, $injector) {
                scope = $rootScope.$new();
                scope.skipCommand = {};

                q = $q;

                skipCommandEditorSvc = jasmine.createSpyObj('skipCommandEditorSvc', [
                    'buildSkipCommand', 'validateSkipCommand', 'spinnerShow', 'spinnerHide',
                    'isSkipCommandRemainError'
                ]);
                skipCommandEditorSvc.buildSkipCommand.and.returnValue({ pageDefinitionId: 1 });

                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', ['resetToViewMode', 'setSurveyEditMode']);

                surveyEditorPageSvc = jasmine.createSpyObj('surveyEditorPageSvc', ['getPageById']);
                surveyEditorPageSvc.getPageById.and.returnValue({});

                pageSvc = jasmine.createSpyObj('pageSvc', ['setSkipCommandEditorId', 'setActivePage']);
                pageDataSvc = jasmine.createSpyObj('pageDataSvc', ['updateSkipCommands']);

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError']);

                questionSvc = jasmine.createSpyObj('questionSvc', ['setActiveQuestion']);

                constantSvc = $injector.get('constantSvc');

                modal = jasmine.createSpyObj('$modal', ['open']);

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                ctrl = $controller('skipCommandEditorCtrl', {
                    $scope: scope,
                    $q: q,
                    skipCommandEditorSvc: skipCommandEditorSvc,
                    surveyEditorSvc: surveyEditorSvc,
                    surveyEditorPageSvc: surveyEditorPageSvc,
                    pageSvc: pageSvc,
                    pageDataSvc: pageDataSvc,
                    errorHandlingSvc: errorHandlingSvc,
                    questionSvc: questionSvc,
                    constantSvc: constantSvc,
                    $modal: modal,
                    spinnerUtilSvc: spinnerUtilSvc
                });
                scope.$digest();
                ctrl.parentPage = {
                    skipCommands: [{}, {}]
                };
            });
        });

        describe('Testing init function', function () {
            it('should setup controller properties', function () {
                expect(ctrl.skipCommand).toBeDefined();
                expect(ctrl.parentPage).toBeDefined();
            });
        });

        describe('Testing saveSkipCommand function', function () {
            beforeEach(function () {
                spyOn(toastr, 'error');
                spyOn(toastr, 'success');
            });

            describe('Testing saveSkipCommand function', function () {
                beforeEach(function () {
                    skipCommandEditorSvc.validateSkipCommand.and.returnValue(true);
                    ctrl.skipCommand.clientId = null;
                    ctrl.skipCommand.expression = {
                        expressionItems: []
                    };
                });

                it('should add new skip command when adding success', function () {
                    pageDataSvc.updateSkipCommands.and.returnValue({ $promise: q.when({}) });

                    ctrl.saveSkipCommand();
                    scope.$digest();
                });

                it('should handle error when adding fail', function () {
                    pageDataSvc.updateSkipCommands.and.returnValue({ $promise: q.reject({}) });

                    ctrl.saveSkipCommand();
                    scope.$digest();
                });
            });
        });
    });
})();