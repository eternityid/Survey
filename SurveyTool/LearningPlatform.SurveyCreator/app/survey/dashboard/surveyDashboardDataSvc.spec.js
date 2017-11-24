(function () {
    'use strict';
    describe('Testing surveyDashboardDataSvc service', function () {
        var httpBackend,
            surveyDashboardDataSvc,
            hostMock = 'http://localhost:52071/api';

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                httpBackend = $injector.get('$httpBackend');
                surveyDashboardDataSvc = $injector.get('surveyDashboardDataSvc');
            });
        });

        describe('Testing getDashboardData function', function () {
            it('should get dashboard data', function () {
                var survey = { surveyId : 1};
                httpBackend.expectGET(hostMock + '/surveys/13/dashboard', survey);
                httpBackend.whenGET(hostMock + '/surveys/13/dashboard').respond({});
                var result = surveyDashboardDataSvc.getDashboardData(survey);

                expect(result).toBeDefined();
            });
        });

    });
})();