(function() {
    describe('Testing surveyTitleAndStatusCtrl controller', function () {
        var scope, surveySvc, surveyDataSvc, stringUtilSvc, errorHandlingSvc, surveyTitleAndStatusSvc, q, ctrl;

        beforeEach(function() {
            module('svt');
            inject(function ($controller, $rootScope, $q) {
                q = $q;
                scope = $rootScope.$new();

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError']);

                surveyDataSvc = jasmine.createSpyObj('surveyDataSvc', ['getSurveyInfo']);
                surveyDataSvc.getSurveyInfo.and.returnValue({ $promise: q.when([{ SurveyStatus: {} }]) });

                surveySvc = jasmine.createSpyObj('surveySvc', ['surveyStatus', 'getStatusDisplay']);

                surveyTitleAndStatusSvc = jasmine.createSpyObj('surveyTitleAndStatusSvc', ['getSettings']);
                surveyTitleAndStatusSvc.getSettings.and.returnValue({});

                stringUtilSvc = jasmine.createSpyObj('stringUtilSvc', ['truncateByWordAmount']);

                ctrl = $controller('surveyTitleAndStatusCtrl', {
                    $scope: scope,
                    errorHandlingSvc: errorHandlingSvc,
                    surveyDataSvc: surveyDataSvc,
                    surveySvc: surveySvc,
                    stringUtilSvc: stringUtilSvc,
                    surveyTitleAndStatusSvc: surveyTitleAndStatusSvc
                });
                scope.$digest();
            });
        });

        describe('Testing setupTitleAndStatus function', function () {
            it('should load survey infor when loading survey was successful', function () {
                ctrl.setupTitleAndStatus();
                scope.$digest();

                expect(stringUtilSvc.truncateByWordAmount).toHaveBeenCalled();
                expect(surveySvc.getStatusDisplay).toHaveBeenCalled();
            });

            it('should process error when loading survey info has problem', function () {
                surveyDataSvc.getSurveyInfo.and.returnValue({ $promise: q.reject() });

                ctrl.setupTitleAndStatus();
                scope.$digest();

                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });

    });
})();