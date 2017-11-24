(function () {
    'use strict';
    describe('Testing exportSurveyCtrl service', function () {
        var exportSurveyCtrl,
            scope,
            q,
            pushDownSvc,
            exportSurveySvc,
            surveyDataSvc,
            surveyEditorSvc,
            spinnerUtilSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $q) {
                q = $q;
                scope = $rootScope.$new();

                pushDownSvc = jasmine.createSpyObj('pushDownSvc', ['hidePushDown', 'setLoadingStatus']);

                exportSurveySvc = jasmine.createSpyObj('exportSurveySvc', ['buildFile']);

                surveyDataSvc = jasmine.createSpyObj('surveyDataSvc', ['exportSurvey']);

                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', ['spinnerShow', 'spinnerHide', 'setSurveyEditMode']);

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                exportSurveyCtrl = $controller('exportSurveyCtrl', {
                    $scope: scope,
                    pushDownSvc: pushDownSvc,
                    exportSurveySvc: exportSurveySvc,
                    surveyDataSvc: surveyDataSvc,
                    surveyEditorSvc: surveyEditorSvc,
                    spinnerUtilSvc: spinnerUtilSvc
                });
                scope.$digest();
            });
        });

        describe('Testing exportSurvey function', function () {
            it('should return error message when export survey fail', function () {
                surveyDataSvc.exportSurvey.and.returnValue({
                    $promise: q.reject()
                });
                exportSurveyCtrl.close = jasmine.createSpy();
                exportSurveyCtrl.exportSurvey();
                scope.$digest();

                expect(surveyDataSvc.exportSurvey).toHaveBeenCalled();
            });

            it('should return file when export survey success', function () {
                surveyDataSvc.exportSurvey.and.returnValue({
                    $promise: q.when({ result: { data: {} } })
                });
                exportSurveyCtrl.exportSurvey();
                scope.$digest();

                expect(surveyDataSvc.exportSurvey).toHaveBeenCalled();
                expect(pushDownSvc.hidePushDown).toHaveBeenCalled();
            });
        });

    });
})();