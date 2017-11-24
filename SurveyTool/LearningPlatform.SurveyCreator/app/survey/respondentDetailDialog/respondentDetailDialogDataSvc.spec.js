(function () {
    'use strict';
    describe('Testing respondentDetailDialogDataSvc service', function () {
        var httpBackend,
            respondentDetailDialogDataSvc,
            hostMock = 'http://localhost:52071/api';

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                httpBackend = $injector.get('$httpBackend');
                respondentDetailDialogDataSvc = $injector.get('respondentDetailDialogDataSvc');
            });
        });

        describe('Testing getRespondentDetail function', function () {
            it('should get respondent detail', function () {
                var conditions = { surveyId: 1, respondentId: 1 };
                httpBackend.expectGET(hostMock + '/surveys/:surveyId/respondents/:respondentId/detail', conditions);
                httpBackend.whenGET(hostMock + '/surveys/:surveyId/respondents/:respondentId/detail').respond({});
                var result = respondentDetailDialogDataSvc.getRespondentDetail(conditions);

                expect(result).toBeDefined();
            });
        });

    });
})();