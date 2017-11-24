(function () {
    'use strict';
    describe('Testing questionSvc service', function () {
        var svc, surveyEditorSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', [
                    'getData', 'generateQuestionAliasAuto'
                ]);
                $provide.value('surveyEditorSvc', surveyEditorSvc);
            });

            inject(function ($injector) {
                svc = $injector.get('questionSvc');
            });
        });

        describe('Testing getQuestionTitle function', function () {
            it('should return question title', function () {
                surveyEditorSvc.getData.and.returnValue({
                    questionTitlesInSurvey: [{
                        id: '1',
                        title: '1'
                    }, {
                        id: '2',
                        title: '2'
                    }]
                });
                var questionId = '2';

                var title = svc.getQuestionTitle(questionId);

                expect(title).toEqual('2');
            });
        });

        describe('Testing setSelectedSurveyId function', function () {
            it('should set selected survey id', function () {
                var surveyId = '10';

                svc.setSelectedSurveyId(surveyId);
                var selectedSurveyId = svc.getSelectedSurveyId();

                expect(selectedSurveyId).toEqual(surveyId);
            });
        });

        describe('Testing setActiveQuestion function', function () {
            it('should set active question', function () {
                var questionId = '10';

                svc.setActiveQuestion(questionId);
                var activeQuestion = svc.getActiveQuestion();

                expect(activeQuestion.questionId).toEqual(questionId);
            });
        });

        describe('Testing getDefaultOptionsMask function', function () {
            it('should return DefaultOptionsMask', function () {
                var defaultOptionsMask = null;

                defaultOptionsMask = svc.getDefaultOptionsMask();

                expect(defaultOptionsMask).not.toEqual(null);
            });
        });

        describe('Testing getMovingPositionByStep function', function () {
            it('should return movingPosition', function () {
                var isPageNext = true;
                var pageDefinitionId = '1';
                var pages = [
                    {
                        id: '1'
                    },
                    {
                        id: '2'
                    }
                ];

                var result = svc.getMovingPositionByStep(isPageNext, pageDefinitionId, pages);

                expect(result.pageDefinitionId).toEqual('2');
            });
        });

        describe('Testing duplicateQuestionExceptId function', function() {
            var sourceQuestion = { id: '1' },
                result;

            it('should generate alias for new question', function() {
                result = svc.duplicateQuestionExceptId(sourceQuestion);

                expect(surveyEditorSvc.generateQuestionAliasAuto).toHaveBeenCalled();
            });
        });
    });
})();