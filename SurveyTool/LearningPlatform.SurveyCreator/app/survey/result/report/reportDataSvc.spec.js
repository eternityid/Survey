(function () {
    'use strict';
    describe('Testing reportDataSvc service', function () {
        var httpBackend,
            reportDataSvc,
            hostMock = 'http://localhost:52071/api';

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                httpBackend = $injector.get('$httpBackend');
                reportDataSvc = $injector.get('reportDataSvc');
            });
        });

        describe('Testing getData function', function () {
            it('should get report data', function () {
                var survey = { surveyId : 1};
                httpBackend.expectGET(hostMock + '/surveys/1/reports/aggregated-respondents', survey);
                httpBackend.whenGET(hostMock + '/surveys/1/reports/aggregated-respondents').respond({});
                var result = reportDataSvc.getData(survey);

                expect(result).toBeDefined();
            });
        });

        describe('Testing getDataForTable function', function () {
            it('should get table data', function () {
                var tableParams = { surveyId: 1, questionKey: 'qk', limit: 10 };
                httpBackend.expectGET(hostMock + '/surveys/1/reports/open-responses?questionKey=qk&limit=10', tableParams);
                httpBackend.whenGET(hostMock + '/surveys/1/reports/open-responses?questionKey=qk&limit=10').respond({});
                var result = reportDataSvc.getDataForTable(tableParams);

                expect(result).toBeDefined();
            });
        });

    });
})();