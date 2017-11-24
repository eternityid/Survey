(function() {
    'use strict';
    describe('Testing surveyDashboardCtrl controller', function() {
        var dashboardCtrl,
            scope,q,
            locationMock,
            errorHandlingSvc,
            surveyDashboardDataSvc,
            surveyDashboardSvc,
            spinnerUtilSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller,$q) {
                q = $q;
                scope = $rootScope.$new();
                scope.$parent = {
                    vm: {}
                };
                locationMock = jasmine.createSpyObj('locationMock', ['path']);
                surveyDashboardDataSvc = jasmine.createSpyObj('surveyDashboardDataSvc', ['getDashboardData']);
                surveyDashboardDataSvc.getDashboardData.and.returnValue({ $promise: q.when({}) });

                surveyDashboardSvc = jasmine.createSpyObj('surveyDashboardSvc', ['renderResponsesStatus', 'renderBarChart', 'renderLineChart']);
                surveyDashboardSvc.renderResponsesStatus.and.returnValue({});
                surveyDashboardSvc.renderBarChart.and.returnValue({});
                surveyDashboardSvc.renderLineChart.and.returnValue({});

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['writeErrorToConsole', 'manifestError']);
                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                dashboardCtrl = $controller('surveyDashboardCtrl', {
                    $scope: scope,
                    $routeParams: { id: '123' },
                    $location: locationMock,
                    errorHandlingSvc: errorHandlingSvc,
                    surveyDashboardDataSvc: surveyDashboardDataSvc,
                    surveyDashboardSvc: surveyDashboardSvc,
                    spinnerUtilSvc: spinnerUtilSvc
                });
            });
        });

        describe('Testing controller properties', function() {
            it('should define required properties', function () {
                expect(dashboardCtrl.surveyId).toBeDefined();
                expect(dashboardCtrl.responsesStatus).toBeDefined();
                expect(dashboardCtrl.barChart).toBeDefined();
                expect(dashboardCtrl.lineChart).toBeDefined();
            });

            it('should receive parameters value', function() {
                expect(dashboardCtrl.surveyId).toBeDefined();
                expect(dashboardCtrl.surveyId).not.toEqual('');
            });
        });

        describe('Testing init function', function () {
            it('should render response status, charts when getting dashboard data was successful', function () {
                dashboardCtrl.init();
                scope.$digest();
                expect(dashboardCtrl.responsesStatus).toEqual({});
                expect(dashboardCtrl.barChart).toEqual({});
                expect(dashboardCtrl.lineChart).toEqual({});
            });
            it('should process error when getting dashboard data has problem', function () {
                surveyDashboardDataSvc.getDashboardData.and.callFake(function () {
                    var defer = q.defer();
                    defer.reject({});
                    return {
                        $promise: defer.promise
                    };
                });
                dashboardCtrl.init();
                scope.$digest();
                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });
    });
})();