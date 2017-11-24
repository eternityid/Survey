(function() {
    'use strict';
    describe('Testing surveySettingsCtrl controller', function() {
        var scope, surveyDataSvc, q, errorHandlingSvc,
        surveySettingsSvc, surveyEditorSvc, spinnerUtilSvc, ctrl;

        beforeEach(function() {
            module('svt');
            inject(function($rootScope, $controller, $q) {
                scope = $rootScope.$new();
                scope.handleAfterSave = jasmine.createSpy();
                q = $q;
                surveyDataSvc = jasmine.createSpyObj('surveyDataSvc', [
                    'addSurvey', 'updateSurveySettings', 'getSurveyBrief']);
                surveyDataSvc.getSurveyBrief.and.returnValue({ $promise: q.when({}) });

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError', 'writeErrorToConsole']);
                surveySettingsSvc = jasmine.createSpyObj('surveySettingsSvc', [
                    'getLayouts', 'validateSurveySettings', 'spinnerShow', 'spinnerHide', 'getPlaceHolders'
                ]);

                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', [
                    'spinnerShow', 'spinnerHide', 'setSurveyEditMode', 'getSurveyEditMode'
                ]);

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                ctrl = $controller('surveySettingsCtrl', {
                    $scope: scope,
                    surveyDataSvc: surveyDataSvc,
                    errorHandlingSvc: errorHandlingSvc,
                    surveySettingsSvc: surveySettingsSvc,
                    surveyEditorSvc: surveyEditorSvc,
                    spinnerUtilSvc: spinnerUtilSvc
                });
            });
        });

        describe('Testing save function', function () {
            it('should not add or update invalid data survey', function () {
                surveySettingsSvc.validateSurveySettings.and.returnValue(false);

                ctrl.save();

                expect(surveyDataSvc.addSurvey).not.toHaveBeenCalled();
                expect(surveyDataSvc.updateSurveySettings).not.toHaveBeenCalled();
            });

            describe('Updating survey', function () {
                beforeEach(function () {
                    surveySettingsSvc.validateSurveySettings.and.returnValue(true);
                    scope.survey = {
                        surveyId: '1',
                        surveySettings: {}
                    };
                });

                it('should show success message when updating survey successfully', function() {
                    spyOn(toastr, 'success');
                    surveyDataSvc.updateSurveySettings.and.returnValue({ $promise: q.when({ status: true }) });

                    ctrl.save();
                    scope.$digest();

                    expect(surveyDataSvc.updateSurveySettings).toHaveBeenCalled();
                    expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
                });

                it('should show error message when updating survey unsuccessfully', function () {
                    spyOn(toastr, 'error');
                    surveyDataSvc.updateSurveySettings.and.returnValue({ $promise: q.reject({ status: false }) });

                    ctrl.save();
                    scope.$digest();

                    expect(surveyDataSvc.updateSurveySettings).toHaveBeenCalled();
                });
            });
        });
    });
})();