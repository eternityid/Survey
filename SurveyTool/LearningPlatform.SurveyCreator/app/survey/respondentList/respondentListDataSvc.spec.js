(function () {
    'use strict';
    describe('Testing respondentListDataSvc service', function () {
        var httpBackend,
            respondentListDataSvc,
            hostMock = 'https://localhost:44302/api';

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                httpBackend = $injector.get('$httpBackend');
                respondentListDataSvc = $injector.get('respondentListDataSvc');
            });
        });

        describe('Testing importContacts function', function () {
            it('should importContacts the file', function () {
                var surveyId = 0,
                    respondentFileName = "";
                httpBackend.expectPOST(hostMock + '/surveys/0/respondents/importcontacts');
                httpBackend.whenPOST(hostMock + '/surveys/0/respondents/importcontacts').respond({});
                var result = respondentListDataSvc.importContacts(surveyId, respondentFileName);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing sendEmail function', function () {
            it('should send the email', function () {
                var sendRespondentForm = { dummy: 'dummy' }, surveyId = 0;
                httpBackend.expectPOST(hostMock + '/surveys/0/respondents/send', { dummy: "dummy" });
                httpBackend.whenPOST(hostMock + '/surveys/0/respondents/send').respond({});
                var result = respondentListDataSvc.sendEmail(surveyId, sendRespondentForm);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing testSendEmail function', function () {
            it('should test the sent email', function () {
                var sendRespondentForm = { dummy: 'dummy' }, surveyId = 0;
                httpBackend.expectPOST(hostMock + '/surveys/0/respondents/testsend', { dummy: "dummy" });
                httpBackend.whenPOST(hostMock + '/surveys/0/respondents/testsend').respond({});
                var result = respondentListDataSvc.testSendEmail(surveyId, sendRespondentForm);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing addRespondents function', function () {
            it('should add new respondents', function () {
                var respondentEmails = ['abc@yahoo.com'],
                    surveyId = 0;

                httpBackend.expectPOST(hostMock + '/surveys/0/respondents');
                httpBackend.whenPOST(hostMock + '/surveys/0/respondents').respond([{ id: 1 }]);
                var result = respondentListDataSvc.addRespondents(surveyId, respondentEmails);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing search function', function () {
            it('should return searching result', function () {
                var surveyId = 0;
                var searchModelMock = {
                    surveyId: surveyId,
                    email: '',
                    status: '',
                    numberSent: '',
                    lastTimeSent: '',
                    NumberSentOperator: '',
                    LastTimeSentOperator: '',
                    paging: {
                        start: 1,
                        limit: 10
                    }
                };
                httpBackend.expectPOST(hostMock + '/surveys/0/respondents/search');
                httpBackend.whenPOST(hostMock + '/surveys/0/respondents/search').respond([{ id: 1, email: 'abc@gmail.com' }]);
                var result = respondentListDataSvc.search(surveyId, searchModelMock);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });
    });
})();