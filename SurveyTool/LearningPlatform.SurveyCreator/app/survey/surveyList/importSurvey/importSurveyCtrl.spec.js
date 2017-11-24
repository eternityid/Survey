(function () {
    'use strict';
    describe('Testing importSurveyCtrl service', function () {
        var importSurveyCtrl,
            scope,
            q,
            pushDownSvc,
            importSurveySvc,
            surveyDataSvc,
            surveyEditorSvc,
            toastr,
            spinnerUtilSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $q) {
                q = $q;
                scope = $rootScope.$new();
                scope.handleAfterSave = jasmine.createSpy();
                pushDownSvc = jasmine.createSpyObj('pushDownSvc', ['hidePushDown', 'setLoadingStatus']);

                importSurveySvc = jasmine.createSpyObj('importSurveySvc', ['getPlaceHolders', 'validate']);

                surveyDataSvc = jasmine.createSpyObj('surveyDataSvc', ['importSurvey']);

                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', ['spinnerShow', 'spinnerHide']);

                toastr = jasmine.createSpyObj('toastr', ['success', 'error']);

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                importSurveyCtrl = $controller('importSurveyCtrl', {
                    $scope: scope,
                    pushDownSvc: pushDownSvc,
                    importSurveySvc: importSurveySvc,
                    surveyDataSvc: surveyDataSvc,
                    surveyEditorSvc: surveyEditorSvc,
                    spinnerUtilSvc: spinnerUtilSvc
                });
                scope.$digest();
            });
        });

        describe('Testing closePushDown function', function () {
            it('should close the push down', function () {
                importSurveyCtrl.close();
                expect(pushDownSvc.hidePushDown).toHaveBeenCalled();
            });
        });

        describe('Testing importSurvey function', function () {
            var placeHolders = {
                surveyTitle: {}
            };

            it('should not import survey when input invalid data', function () {
                var surveyViewModel = {
                    title: null,
                    file: null
                };

                importSurveyCtrl.importSurvey(surveyViewModel, placeHolders);

                expect(importSurveySvc.validate).toHaveBeenCalled();
            });

            it('should not import survey when input invalid data', function () {
                importSurveySvc.validate.and.returnValue(true);
                surveyDataSvc.importSurvey.and.returnValue({
                    $promise: q.reject({data: {}})
            });
                importSurveyCtrl.importSurvey();
                scope.$digest();

                expect(importSurveySvc.validate).toHaveBeenCalled();
                expect(surveyDataSvc.importSurvey).toHaveBeenCalled();
            });

            it('should import survey when input valid data', function () {
                importSurveySvc.validate.and.returnValue(true);
                surveyDataSvc.importSurvey.and.returnValue({
                    $promise: q.when()
                });
                importSurveyCtrl.importSurvey();
                scope.$digest();

                expect(importSurveySvc.validate).toHaveBeenCalled();
                expect(surveyDataSvc.importSurvey).toHaveBeenCalled();
                expect(pushDownSvc.hidePushDown).toHaveBeenCalled();
            });
        });

    });
})();