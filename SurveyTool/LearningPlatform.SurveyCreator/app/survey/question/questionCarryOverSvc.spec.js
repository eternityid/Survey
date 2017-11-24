(function () {
    'use strict';
    describe('Testing questionCarryOverSvc service', function () {
        var svc, surveyEditorSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', [
                    'getQuestionsWithOptions'
                ]);

                $provide.value('surveyEditorSvc', surveyEditorSvc);
            });

            inject(function($injector) {
                svc = $injector.get('questionCarryOverSvc');
            });
        });

        describe('Testing getChildQuestionIds function', function () {
            var questionId = 0,
                result;

            it('should return related question ids', function () {
                svc.data.relationships = [{ childQuestionIds: [1] }];

                result = svc.getChildQuestionIds(questionId);

                expect(result.length).toEqual(1);
            });

            it('should return empty array with no related questions', function () {
                result = svc.getChildQuestionIds(questionId);

                expect(result.length).toEqual(0);
            });
        });

        describe('Testing getChildQuestionPositions function', function () {
            it('should return children question positions', function () {
                var questionId = 1;
                spyOn(svc, 'getChildQuestionIds').and.returnValue([3]);
                svc.data.questions = [{ id: 1 }, { id: 3, positionInSurvey: 2 }];

                var result = svc.getChildQuestionPositions(questionId);

                expect(svc.getChildQuestionIds).toHaveBeenCalled();
                expect(result[0]).toBeDefined();
            });
        });

        describe('Testing getCarriedOverQuestionIdsByOptions function', function () {
            var options = [{}, { optionsMask: { questionId: 1 } }, { optionsMask: { questionId: 2 } }],
                result;

            it('should return carried over question ids and children ids', function () {
                svc.data.relationships[1] = { carriedOverQuestionIds: [4, 5] };

                result = svc.getCarriedOverQuestionIdsByOptions(options);

                expect(result.length).toEqual(4);
            });

            it('should return carried over question ids', function () {
                result = svc.getCarriedOverQuestionIdsByOptions(options);

                expect(result.length).toEqual(2);
            });
        });

        describe('Testing getAvailableCarryOverQuestions function', function () {
            it('should return available carried over questions', function () {
                var questionId = 1;
                spyOn(svc, 'getChildQuestionIds').and.returnValue([2]);
                svc.data.questions = [{ id: 1 }, { id: 2 }, { id: 3, canBeCarriedOverTwoWay: true, title: { items: [{ text: '' }] } }];

                var result = svc.getAvailableCarryOverQuestions(questionId);

                expect(result.length).toEqual(1);
            });
        });

        describe('Testing getAvailableCarryOverQuestionsForOption function', function () {
            it('should return available carried over questions', function () {
                var questionId = 1,
                    remainingOptions = [];
                spyOn(svc, 'getChildQuestionIds').and.returnValue([2]);
                spyOn(svc, 'getCarriedOverQuestionIdsByOptions').and.returnValue([3]);
                svc.data.questions = [{ id: 1 }, { id: 2 }, { id: 4, canBeCarriedOverTwoWay: true, title: { items: [{ text: '' }] } }];

                var result = svc.getAvailableCarryOverQuestionsForOption(questionId);

                expect(result.length).toEqual(1);
            });
        });

        describe('Testing getExpandOptions function', function () {
            it('should return all related options', function () {
                var questionId = 1,
                    options = [{ optionsMask: {} }];
                spyOn(svc, 'getCarriedOverQuestionIdsByOptions').and.returnValue([3]);

                var result = svc.getExpandOptions(questionId, options);

                expect(result.length).toEqual(1);
            });
        });

        describe('Testing getQuestionWithOptionsById function', function () {
            var questionId = 2,
                result;

            it('should return question when it exists', function () {
                svc.data.questions = [{ id: 1 }, { id: 2 }];

                result = svc.getQuestionWithOptionsById(questionId);

                expect(result).toEqual(jasmine.any(Object));
                expect(result.id).toBeDefined();
            });

            it('should return null when question does not exist', function () {
                svc.data.questions = [{ id: 1 }];

                var result = svc.getQuestionWithOptionsById(questionId);

                expect(result).toEqual(null);
            });
        });

        describe('Testing getOptionsMaskQuestionTitle function', function () {
            var questionId = 1,
                result;

            it('should return empty title with invalid question id', function () {
                svc.data.questions = [{ id: 2 }];

                result = svc.getOptionsMaskQuestionTitle(questionId);

                expect(result).toEqual('');
            });

            it('should return the title of valid question', function () {
                svc.data.questions = [{ id: 1, canBeCarriedOverTwoWay: true, title: { items: [{ text: 'dummy' }] } }];

                var result = svc.getOptionsMaskQuestionTitle(questionId);

                expect(result).not.toEqual('');
            });
        });

        describe('Testing setupData function', function () {
            it('should setup question and question relationship', function () {
                surveyEditorSvc.getQuestionsWithOptions.and.returnValue([
                    { optionList: {}, subQuestionDefinition: {} },
                    { optionList: {}, subQuestionDefinition: { $type: 'OpenEndedShortTextQuestionDefinition' } },
                    { optionList: { options: [{}] }, title: { items: [{ text: 'dummy' }] } }]);
                svc.data.questions = [{ optionList: { options: [{ optionsMask: { questionId: 1 } }, {}] } }];
                spyOn(angular, 'copy');

                svc.setupData();

                expect(surveyEditorSvc.getQuestionsWithOptions).toHaveBeenCalled();
            });
        });
    });
})();