(function () {
    'use strict';
    describe('Testing reportCtrl controller', function () {
        var reportCtrl,
            scope, q,
            locationMock,
            reportSvc,
            errorHandlingSvc,
            reportDataSvc,
            questionSvc,
            spinnerUtilSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $q) {
                q = $q;
                scope = $rootScope.$new();
                scope.$parent = {
                    vm: {}
                };
                locationMock = jasmine.createSpyObj('locationMock', ['path']);
                reportSvc = jasmine.createSpyObj('reportSvc', ['showSpinner', 'hideSpinner']);
                reportDataSvc = jasmine.createSpyObj('reportDataSvc', ['getData']);
                reportDataSvc.getData.and.returnValue({ $promise: q.when({ SurveyName: 'Dummy', TotalRespondents: 10, Questions: {} }) });

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['writeErrorToConsole', 'manifestError']);

                questionSvc = jasmine.createSpyObj('questionSvc', ['getQuestionTypeEnum']);

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                reportCtrl = $controller('reportCtrl', {
                    $scope: scope,
                    $routeParams: { id: '123' },
                    $location: locationMock,
                    reportSvc: reportSvc,
                    errorHandlingSvc: errorHandlingSvc,
                    reportDataSvc: reportDataSvc,
                    questionSvc: questionSvc,
                    spinnerUtilSvc: spinnerUtilSvc
                });
            });
        });

        describe('Testing controller properties', function () {
            it('should define required properties', function () {
                expect(reportCtrl.surveyId).toBeDefined();
                expect(reportCtrl.reportTitleDisplay).toBeDefined();
                expect(reportCtrl.totalRespondents).toBeDefined();
                expect(reportCtrl.responsesReport).toBeDefined();
            });

            it('should receive parameters value', function () {
                expect(reportCtrl.surveyId).toBeDefined();
                expect(reportCtrl.surveyId).not.toEqual('');
            });
        });

        describe('Testing init function', function () {
            it('should process error when getting report data has problem', function () {
                reportDataSvc.getData.and.callFake(function () {
                    var defer = q.defer();
                    defer.reject({});
                    return {
                        $promise: defer.promise
                    };
                });
                reportCtrl.init();
                scope.$digest();
                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });
    });
})();