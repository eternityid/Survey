(function () {
    'use strict';
    describe('Testing exportResponsesDataSvc service', function () {
        var httpBackend,
            exportResponsesDataSvc,
            hostMock = 'https://localhost:44302/api';

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                httpBackend = $injector.get('$httpBackend');
                exportResponsesDataSvc = $injector.get('exportResponsesDataSvc');
            });
        });

        describe('Testing testSendEmail function', function () {
            it('should test the sent email', function () {
                var settings = {surveyId: 0};
                httpBackend.expectPOST(hostMock + '/surveys/0/responses/export', settings);
                httpBackend.whenPOST(hostMock + '/surveys/0/responses/export').respond({});
                var result = exportResponsesDataSvc.exportResponses(settings);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });
    });
})();