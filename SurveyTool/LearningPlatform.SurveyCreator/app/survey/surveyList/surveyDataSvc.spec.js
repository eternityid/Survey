(function() {
    'use strict';
    describe('Testing surveyDataSvc service', function() {
        var httpBackend,
            surveyDataSvc,
            hostMock = 'https://localhost:44302/api';

        beforeEach(function() {
            module('svt');
            inject(function($injector) {
                httpBackend = $injector.get('$httpBackend');
                surveyDataSvc = $injector.get('surveyDataSvc');
            });
        });

        describe('Testing search function', function() {
            it('should return searching result', function() {
                var searchFormMock = {
                    searchModel: {
                        searchString: 'abc'
                    },
                    paging: {
                        start: 1,
                        limit: 10
                    }
                };
                httpBackend.expectPOST(hostMock + '/surveys/search', { searchString: 'abc', start: 1, limit: 10 });
                httpBackend.whenPOST(hostMock + '/surveys/search', { searchString: 'abc', start: 1, limit: 10 })
                    .respond([{ id: 1, name: 'a' }]);

                var result = surveyDataSvc.search(searchFormMock);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing deleteSurvey function', function() {
            it('should delete survey', function() {
                var surveyId = 123;
                httpBackend.expectPUT(hostMock + '/surveys/123/delete', { surveyId: surveyId });
                httpBackend.whenPUT(hostMock + '/surveys/123/delete').respond({});

                var result = surveyDataSvc.deleteSurvey(surveyId);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing getSurveyInfo function', function () {
            it('should return survey info', function () {
                var surveyId = 1;
                httpBackend.expectGET(hostMock + '/surveys/1/surveyinfo');
                httpBackend.whenGET(hostMock + '/surveys/1/surveyinfo').respond({});

                var result = surveyDataSvc.getSurveyInfo(surveyId);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing importSurvey function', function () {
            it('should import survey', function () {
                var surveyViewModel = {
                    title: 'dummy',
                    file: 'dummy'
                };
                httpBackend.expectPOST(hostMock + '/surveys/import', {}).respond({});

                var result = surveyDataSvc.importSurvey(surveyViewModel);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing exportSurvey function', function () {
            it('should export survey', function () {
                var surveyId = 1;
                httpBackend.expectPOST(hostMock + '/surveys/1/export');
                httpBackend.whenPOST(hostMock + '/surveys/1/export').respond({});

                var result = surveyDataSvc.exportSurvey(surveyId);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });
    });
})();