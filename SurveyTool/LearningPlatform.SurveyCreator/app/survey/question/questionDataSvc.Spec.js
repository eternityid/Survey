(function () {
    'use strict';
    describe('Testing questionDataSvc service', function () {
        var httpBackend,
            questionDataSvc,
            hostMock = 'https://localhost:44302/api';

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                httpBackend = $injector.get('$httpBackend');
                questionDataSvc = $injector.get('questionDataSvc');
            });
        });

        describe('Testing getAllById function', function() {
            it('should return all questions based on survey ID and Page ID', function () {
                var surveyId = 3,
                    pageId = 4;
                httpBackend.expectGET(hostMock + '/surveys/3/pages/4/questions');
                httpBackend.whenGET(hostMock + '/surveys/3/pages/4/questions').respond([{ dummy: 'dummy' }]);
                var result = questionDataSvc.getAllById(surveyId, pageId);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing addNew function', function () {
            it('should add the new question', function () {
                var questionMock = { surveyId: 3, $type: 'InformationDefinition' };
                var questionIndex = 0;
                var pageId = 1;

                httpBackend.expectPOST(hostMock + '/surveys/' + questionMock.surveyId + '/pages/' + pageId + '/questions', { question: questionMock, questionIndex: questionIndex });
                httpBackend.whenPOST(hostMock + '/surveys/' + questionMock.surveyId + '/pages/' + pageId + '/questions').respond({});
                var result = questionDataSvc.addNew(questionMock, questionIndex, pageId);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing updateById function', function () {
            it('should update question by id', function () {
                var surveyId = '2',
                    pageId = '3',
                    question = { id: '4', rowVersion: {} };

                httpBackend.expectPUT(hostMock + '/surveys/2/pages/3/questions/4', { question: question });
                httpBackend.whenPUT(hostMock + '/surveys/2/pages/3/questions/4').respond({});

                var result = questionDataSvc.updateById(surveyId, pageId, question);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing deleteById function', function () {
            it('should delete question', function () {
                var surveyId = '3',
                    pageId = '2',
                    question = { id: '4' };

                httpBackend.expectDELETE(hostMock + '/surveys/3/pages/2/questions/4');
                httpBackend.whenDELETE(hostMock + '/surveys/3/pages/2/questions/4').respond({});

                var result = questionDataSvc.deleteById(surveyId, pageId, question);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing moveQuestion function', function () {
            it('should move question inside page', function () {
                var movingQuestionMock = {
                    surveyId: '3',
                    departurePageId: '4',
                    questionId: '5',
                    version: {}
                };
                var parentPageVersion = "dummy";
                httpBackend.expectPOST(hostMock + '/surveys/3/pages/4/questions/5/move');
                httpBackend.whenPOST(hostMock + '/surveys/3/pages/4/questions/5/move').respond({});
                var result = questionDataSvc.moveQuestion(movingQuestionMock, parentPageVersion);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });
    });
})();