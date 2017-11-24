(function () {
    'use strict';
    describe('Testing selectionOptionListSvc service', function () {
        var svc,
            surveyEditorValidationSvc,
            surveyEditorMessageSvc,
            languageStringUtilSvc,
            guidUtilSvc,
            stringUtilSvc,
            questionCarryOverSvc,
            surveyContentValidation,
            questionTypeSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                surveyEditorValidationSvc = jasmine.createSpyObj('surveyEditorValidationSvc', [
                    'getQuestionPositionsHaveQuestionMarkUseOptions', 'getPageTitlesHaveSkipCommandUseOptions'
                ]);
                surveyEditorMessageSvc = jasmine.createSpyObj('surveyEditorMessageSvc', ['buildReferenceQuestionPageMessageContent']);
                languageStringUtilSvc = jasmine.createSpyObj('languageStringUtilSvc', ['buildLanguageString']);
                guidUtilSvc = jasmine.createSpyObj('guidUtilSvc', ['createGuid']);
                stringUtilSvc = jasmine.createSpyObj('stringUtilSvc', ['isEmpty', 'isEquals', 'getPlainText']);
                questionCarryOverSvc = jasmine.createSpyObj('questionCarryOverSvc', ['getExpandOptions']);
                surveyContentValidation = jasmine.createSpyObj('surveyContentValidation', ['getQuestionMapByQuestionId']);
                surveyContentValidation.getQuestionMapByQuestionId.and.returnValue({ type: 'dummy' });
                questionTypeSvc = jasmine.createSpyObj('questionTypeSvc', ['canCarryOverFrom']);

                $provide.value('surveyEditorValidationSvc', surveyEditorValidationSvc);
                $provide.value('surveyEditorMessageSvc', surveyEditorMessageSvc);
                $provide.value('languageStringUtilSvc', languageStringUtilSvc);
                $provide.value('guidUtilSvc', guidUtilSvc);
                $provide.value('stringUtilSvc', stringUtilSvc);
                $provide.value('questionCarryOverSvc', questionCarryOverSvc);
                $provide.value('surveyContentValidation', surveyContentValidation);
                $provide.value('questionTypeSvc', questionTypeSvc);
            });

            inject(function ($injector) {
                svc = $injector.get('selectionOptionListSvc');
            });
        });

        describe('Testing getValidateMessagesWhenRemovingOptions function', function () {
            var question,
                options = [{ text: { items: [{ text: 'dummy' }] } }],
                result;

            it('should return empty message when there are no question or page use option', function () {
                surveyEditorValidationSvc.getQuestionPositionsHaveQuestionMarkUseOptions.and.returnValue([]);
                surveyEditorValidationSvc.getPageTitlesHaveSkipCommandUseOptions.and.returnValue([]);

                result = svc.getValidateMessagesWhenRemovingOption(question, options);

                expect(result.message).toEqual('');
            });

            it('should return not empty message when option is used in another thing', function () {
                surveyEditorValidationSvc.getQuestionPositionsHaveQuestionMarkUseOptions.and.returnValue([{}]);

                result = svc.getValidateMessagesWhenRemovingOption(question, options);

                expect(result.message.indexOf('affect other questions')).toBeGreaterThan(-1);
            });
        });

        describe('Testing buildDefaultOptions function', function () {
            var result,
                surveyId = 1,
                isTopic;

            it('should build topic option', function () {
                isTopic = true;

                result = svc.buildDefaultOptions(surveyId, isTopic);

                expect(languageStringUtilSvc.buildLanguageString).toHaveBeenCalledWith(surveyId, 'Topic 1');
                expect(result.length).toEqual(1);
            });

            it('should build normal option', function () {
                isTopic = false;

                result = svc.buildDefaultOptions(surveyId, isTopic);

                expect(languageStringUtilSvc.buildLanguageString).toHaveBeenCalledWith(
                    surveyId, 'Option 1');
            });
        });

        describe('Testing buildNewOptionBasedOnExistedOptions function', function () {
            var result,
                optionList,
                isTopic;

            it('should build Topic option', function () {
                isTopic = true;
                var existedAliases = [{}],
                    newOptionAlias = 1;
                optionList = { id: 1, surveyId: 1, options: [{ alias: 11 }], optionGroups: [] };

                result = svc.buildNewOptionBasedOnExistedOptions(optionList, isTopic);

                expect(languageStringUtilSvc.buildLanguageString).toHaveBeenCalled();
            });
        });

        describe('Testing buildDefaultOtherQuestionDefinition function', function () {
            var result,
                surveyId = 1;

            it('should built default questionDefinition', function () {
                result = svc.buildDefaultOtherQuestionDefinition(surveyId);

                expect(result.surveyId).toEqual(1);
            });
        });

        describe('Testing validateOptions function', function () {
            var questionId, options = [], optionGroups = [], result;

            beforeEach(function () {
                spyOn(svc, 'validateOptionTitles');
                spyOn(svc, 'validateOptionAliases');
            });

            it('should detect invalid option title', function () {
                svc.validateOptionTitles.and.returnValue({ valid: false });

                result = svc.validateOptions(questionId, options, optionGroups);

                expect(svc.validateOptionTitles).toHaveBeenCalled();
                expect(result.valid).toEqual(false);
            });

            it('should detect carry over option has invalid type', function () {
                options = [{ isCarryOverOption: false }, { isCarryOverOption: true, optionsMask: {} }];
                svc.validateOptionTitles.and.returnValue({ valid: true });

                result = svc.validateOptions(questionId, options, optionGroups);

                expect(result.valid).toEqual(false);
                expect(result.message).toEqual('Option at position "2" is missing Carry Over Option Type.');
            });

            it('should detect carry over option has invalid refered question', function () {
                options = [{ isCarryOverOption: true, optionsMask: { optionsMaskType: 'All' } }];
                svc.validateOptionTitles.and.returnValue({ valid: true });

                result = svc.validateOptions(questionId, options, optionGroups);

                expect(result.valid).toEqual(false);
                expect(result.message).toEqual('Option at position "1" is missing Carry Over From Question.');
            });

            it('should validate option alias', function () {
                options = [{ isCarryOverOption: true, optionsMask: { optionsMaskType: 'All', questionId: 1 } }];
                svc.validateOptionTitles.and.returnValue({ valid: true });

                result = svc.validateOptions(questionId, options, optionGroups);
            });
        });

        describe('Testing validateOptionTitles function', function () {
            var expandOptions = [],
                result,
                questionId = 1,
                options = [
                    {
                        isCarryOverOption: false,
                        text: {
                            items: [{ text: 'option 1' }]
                        },
                        guid: 'guid here'
                    }
                ];

            it('should return Option title message when there are option', function () {
                stringUtilSvc.isEmpty.and.returnValue(true);

                result = svc.validateOptionTitles(questionId, options, expandOptions);

                expect(result.message.indexOf('Option at position')).toBeGreaterThan(-1);
            });

            it('should return Option Title message due to expendOption', function () {
                expandOptions = [
                    {
                        isCarryOverOption: false,
                        parentQuestionId: 1,
                        id: 1,
                        text: {
                            items: [{ text: 'Option 1' }]
                        },
                        guid: 'guid 1'
                    },
                    {
                        isCarryOverOption: false,
                        parentQuestionId: 1,
                        parentQuestionTitle: 'Title 2',
                        id: 2,
                        text: {
                            items: [{ text: 'Option 1' }]
                        },
                        guid: 'guid 2'
                    }
                ];
                stringUtilSvc.isEquals.and.returnValue(true);

                result = svc.validateOptionTitles(questionId, options, expandOptions);

                expect(result.message).not.toEqual('');
                expect(result.valid).toEqual(true);
            });
        });

        describe('Testting validateOptionAliases function', function () {
            var expandOptions = [],
                result,
                questionId = 1,
                options = [
                    {
                        isCarryOverOption: false,
                        alias: 'Alias here',
                        guid: 'guid here'
                    }
                ];

            it('should return Option at position message when there are alias', function () {
                stringUtilSvc.isEmpty.and.returnValue(true);

                result = svc.validateOptionAliases(questionId, options, expandOptions);

                expect(result.valid).toEqual(false);
                expect(result.message).not.toEqual('');
            });

            it('should return Option at position message due to expendOption', function () {
                expandOptions = [
                    {
                        isCarryOverOption: false,
                        parentQuestionId: 1,
                        id: 1,
                        alias: 'Alias 1',
                        guid: 'guid 1'
                    },
                    {
                        isCarryOverOption: false,
                        parentQuestionId: 1,
                        parentQuestionTitle: 'Title 2',
                        id: 2,
                        alias: 'Alias 1',
                        guid: 'guid 2'
                    }
                ];
                stringUtilSvc.isEquals.and.returnValue(true);

                result = svc.validateOptionAliases(questionId, options, expandOptions);

                expect(result.valid).toEqual(false);
                expect(result.message).not.toEqual('');
            });
        });

    });
})();