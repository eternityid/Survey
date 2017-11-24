(function () {
    'use strict';

    describe('Testing generateRandomResponsesDataSvc service', function () {
        var httpBackEnd,
            generateRandomResponsesDataSvc,
            hostMock = 'http://localhost:52071/api';

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                httpBackEnd = $injector.get('$httpBackend');
                generateRandomResponsesDataSvc = $injector.get('generateRandomResponsesDataSvc');
            });
        });


        describe('Testing generateRandomData function', function () {
            it('should generate random data', function () {
                var surveyId = 1,
                    interations = 10;

                httpBackEnd.expectPOST(hostMock + '/surveys/123/responses/generate');
                httpBackEnd.whenPOST(hostMock + '/surveys/123/responses/generate').respond({});

                var result = generateRandomResponsesDataSvc.generateRandomData(surveyId, interations);

                expect(result).toBeDefined();
            });
        });
    });
})();