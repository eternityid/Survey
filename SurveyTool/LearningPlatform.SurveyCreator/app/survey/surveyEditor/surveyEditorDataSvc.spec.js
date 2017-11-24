(function() {
    'use strict';
    describe('Testing surveyEditorDataSvc service', function () {
        var httpBackend,
            surveyEditorDataSvc,
            hostMock = 'https://localhost:44302/api';

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                httpBackend = $injector.get('$httpBackend');
                surveyEditorDataSvc = $injector.get('surveyEditorDataSvc');
            });
        });

        describe('Testing getSurvey function', function () {
            it('should return survey', function () {
                var surveyId = 1;
                httpBackend.expectGET(hostMock + '/surveys/1');
                httpBackend.whenGET(hostMock + '/surveys/1').respond({ dummy: 'dummy' });
                var result = surveyEditorDataSvc.getSurvey(surveyId);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });
    });
})();