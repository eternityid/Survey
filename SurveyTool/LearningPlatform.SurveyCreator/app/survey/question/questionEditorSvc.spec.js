(function () {
    'use strict';
    describe('Testing questionEditorSvc service', function () {
        var svc, stringUtilSvc, arrayUtilSvc, surveyEditorValidationSvc,
            surveyEditorMessageSvc, questionCarryOverSvc, serverValidationSvc,
            questionWithOptionsSvc;

        var VALIDATION_TYPES = {
            required: 'RequiredValidation',
            length: 'LengthValidation',
            wordsAmount: 'WordsAmountValidation',
            selection: 'SelectionValidation'
        };

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                stringUtilSvc = jasmine.createSpyObj('stringUtilSvc', [
                    'isEmpty'
                ]);
                $provide.value('stringUtilSvc', stringUtilSvc);

                arrayUtilSvc = jasmine.createSpyObj('arrayUtilSvc', [
                  'hasValueIn', 'isElementHasSubElement'
                ]);
                $provide.value('arrayUtilSvc', arrayUtilSvc);

                surveyEditorValidationSvc = jasmine.createSpyObj('surveyEditorValidationSvc', [
                  'getPageTitlesHaveSkipCommandUseQuestion',
                  'getPageTitlesHaveSkipCommandUseOutOfRange',
                  'getQuestionPositionsHaveQuestionMarkUseQuestion',
                  'getQuestionPositionsHaveQuestionMarkUseOutOfRange',
                  'getQuestionPositionsHaveOptionMarkUseQuestions'
                ]);
                $provide.value('surveyEditorValidationSvc', surveyEditorValidationSvc);

                surveyEditorMessageSvc = jasmine.createSpyObj('surveyEditorMessageSvc', [
                    'buildReferenceQuestionPageMessageContent'
                ]);
                $provide.value('surveyEditorMessageSvc', surveyEditorMessageSvc);

                questionCarryOverSvc = jasmine.createSpyObj('questionCarryOverSvc', [
                   'getChildQuestionPositions'
                ]);
                $provide.value('questionCarryOverSvc', questionCarryOverSvc);

                serverValidationSvc = jasmine.createSpyObj('serverValidationSvc', [
                    'getServerValidationTypes'
                ]);
                $provide.value('serverValidationSvc', serverValidationSvc);

                questionWithOptionsSvc = jasmine.createSpyObj('questionWithOptionsSvc', [
                    'getDefaultOptionsMask'
                ]);
                $provide.value('questionWithOptionsSvc', questionWithOptionsSvc);
            });
            inject(function ($injector) {
                svc = $injector.get('questionEditorSvc');
            });
        });

        describe('Testing cleanOptionsMask function', function () {
            var question = { $type: 'SingleSelectionQuestionDefinition', advancedSettings: {} };

            it('should reset options mask', function () {
                question.advancedSettings.isUseOptionMask = false;

                svc.cleanOptionsMask(question);

                expect(questionWithOptionsSvc.getDefaultOptionsMask).toHaveBeenCalled();
            });

            it('should reset options mask', function () {
                question.advancedSettings.isUseOptionMask = true;

                svc.cleanOptionsMask(question);

                expect(questionWithOptionsSvc.getDefaultOptionsMask).not.toHaveBeenCalled();
            });
        });

        describe('Testing cleanValidationsForSaving function', function () {
            it('should clean unnessessary validations', function () {
                var originalValidations = [
                        {
                            $type: VALIDATION_TYPES.required,
                            selected: false
                        },
                        {
                            $type: VALIDATION_TYPES.length
                        },
                        {
                            $type: VALIDATION_TYPES.selection
                        }
                ];
                var question = {
                    $type: 'ShortTextListQuestionDefinition',
                    validations: originalValidations
                };

                serverValidationSvc.getServerValidationTypes.and.returnValue(VALIDATION_TYPES);
                stringUtilSvc.isEmpty.and.returnValue(true);

                svc.cleanValidationsForSaving(question);

                expect(question.validations.length).not.toEqual(originalValidations.length);
            });
        });

        describe('Testing settingQuestionForCreating function', function () {
            it('should setting question for creating', function () {
                var surveyId = 1;
                var vm = {
                    question: {
                        title: {},
                        description: {},
                        questionMaskExpression: {
                            expressionItems: ['dummy']
                        },
                        validations: [],
                        surveyId: surveyId,
                        optionList: {}
                    }
                };

                svc.settingQuestionForCreating(vm);

                var result = svc.settingQuestionForCreating(vm);

                expect(result.title.surveyId).toEqual(surveyId);
            });
        });

        describe('Testing settingQuestionForUpdating function', function () {
            it('should setting question for udating', function () {
                var vm = {
                    question: {
                        validations: [{
                            $type: VALIDATION_TYPES.required,
                            selected: false
                        }]
                    }
                };
                serverValidationSvc.getServerValidationTypes.and.returnValue(VALIDATION_TYPES);

                var result = svc.settingQuestionForUpdating(vm);

                expect(result.validations.length).not.toEqual(1);
            });
        });

        describe('Testing getValidationMessageWhenChangingQuestionType function', function () {
            var newQuestionType = 'SingleSelectionQuestionDefinition';
            var originalQuestion = {
                $type: 'SingleSelectionQuestionDefinition',
                optionList: {}
            };

            it('should return empty validation message when question type not changed', function () {
                var result = svc.getValidationMessageWhenChangingQuestionType(originalQuestion, newQuestionType);

                expect(result.willBeAffectedOther).toEqual(false);
                expect(result.message).toEqual('');
            });

            it('should return validation message when question type changed', function () {
                newQuestionType = 'OpenEndedShortTextQuestionDefinition';
                questionCarryOverSvc.getChildQuestionPositions.and.returnValue(['q1']);
                surveyEditorValidationSvc.getQuestionPositionsHaveQuestionMarkUseQuestion.and.returnValue(['1']);
                surveyEditorValidationSvc.getPageTitlesHaveSkipCommandUseQuestion.and.returnValue(['p2']);
                arrayUtilSvc.isElementHasSubElement.and.returnValue(true);

                var result = svc.getValidationMessageWhenChangingQuestionType(originalQuestion, newQuestionType);

                expect(result.willBeAffectedOther).toEqual(true);
                expect(result.message).not.toEqual('');
            });
        });


        describe('Testing getValidationMessageWhenChangingOptionRange function', function () {
            var question = {
                $type: 'RatingQuestionDefinition',
                optionList: {}
            };

            it('should return empty validation message when question type is not rating or scale', function () {
                arrayUtilSvc.hasValueIn.and.returnValue(false);

                var result = svc.getValidationMessageWhenChangingOptionRange(question);

                expect(result.willBeAffectedOther).toEqual(false);
                expect(result.message).toEqual('');
            });

            it('should return validation message', function () {
                arrayUtilSvc.hasValueIn.and.returnValue(true);
                surveyEditorValidationSvc.getQuestionPositionsHaveQuestionMarkUseOutOfRange.and.returnValue([1]);
                surveyEditorValidationSvc.getPageTitlesHaveSkipCommandUseOutOfRange.and.returnValue(['p2']);
                arrayUtilSvc.isElementHasSubElement.and.returnValue(true);

                var result = svc.getValidationMessageWhenChangingOptionRange(question);

                expect(result.willBeAffectedOther).toEqual(true);
                expect(result.message).not.toEqual('');
            });
        });

        describe('Testing isQuestionChanged function', function () {
            var originalQuestion = {
                $type: 'SingleSelectionQuestionDefinition',
                validations: []
            };

            var newQuestion = {
                $type: 'RatingQuestionDefinition',
                validations: [{}]
            };

            it('should return true when question type changed', function () {
                var result = svc.isQuestionChanged(originalQuestion, newQuestion);

                expect(result).toEqual(true);
            });


            it('should return false when question doesnt changes', function () {
                var result = svc.isQuestionChanged(originalQuestion, originalQuestion);

                expect(result).toEqual(false);
            });
        });

    });
})();