(function () {
    'use strict';

    describe('Testing launchDataSvc service', function () {
        var httpBackEnd,
            launchDataSvc,
            surveyDataSvc,
            hostMock = 'https://localhost:44302/api';

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                httpBackEnd = $injector.get('$httpBackend');
                launchDataSvc = $injector.get('launchDataSvc');
                surveyDataSvc = $injector.get('surveyDataSvc');
            });
        });

        describe('Testing sendEmail function', function () {
            it('should send email', function () {
                var surveyId = 1;
                var dataPost = {
                    emailAddreses: ['dump@dump'],
                    subject: '',
                    contentX: ''
                };
                httpBackEnd.expectPOST(hostMock + '/surveys/1/respondents/launch/email', dataPost);
                httpBackEnd.whenPOST(hostMock + '/surveys/1/respondents/launch/email').respond({});
                var result = launchDataSvc.sendEmail(surveyId, dataPost);
                httpBackEnd.flush();

                expect(result).toBeDefined();
            });
        });
    });
})();