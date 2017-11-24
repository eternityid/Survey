(function () {
    describe('Testing textListQuestionSvc service', function () {
        var svc,
            guidUtilSvc,
            languageStringUtilSvc,
            questionConst,
            selectionOptionListSvc,
            serverValidationSvc,
            textQuestionSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide, $injector) {
                guidUtilSvc = jasmine.createSpyObj('guidUtilSvc', ['createGuid']);

                languageStringUtilSvc = jasmine.createSpyObj('languageStringUtilSvc', ['buildLanguageString']);

                questionConst = $injector.get('questionConst');

                selectionOptionListSvc = jasmine.createSpyObj('selectionOptionListSvc', ['validateOptions']);

                serverValidationSvc = jasmine.createSpyObj('serverValidationSvc', ['getServerValidationTypes']);
                serverValidationSvc.getServerValidationTypes.and.returnValue({
                    required: 'RequiredValidation',
                    length: 'LengthValidation',
                    wordsAmount: 'WordsAmountValidation',
                    selection: 'SelectionValidation'
                });

                textQuestionSvc = jasmine.createSpyObj('textQuestionSvc', [
                    'validateCharacters', 'validateWords',
                    'validateRows'
                ]);

                $provide.value('guidUtilSvc', guidUtilSvc);
                $provide.value('languageStringUtilSvc', languageStringUtilSvc);
                $provide.value('selectionOptionListSvc', selectionOptionListSvc);
                $provide.value('guidUtilSvc', guidUtilSvc);
                $provide.value('serverValidationSvc', serverValidationSvc);
                $provide.value('textQuestionSvc', textQuestionSvc);
            });

            inject(function ($injector) {
                svc = $injector.get('textListQuestionSvc');
            });
        });

        describe('Testing buildDefaultSubQuestionDefinition function', function () {
            var parentQuestion = { surveyId: 1 };
            var isLongTextList = false;
            it('should build sub-question for Short Text List question', function () {
                isLongTextList = false;
                var subQuestion = svc.buildDefaultSubQuestionDefinition(parentQuestion, isLongTextList);

                expect(subQuestion).toBeDefined();
                expect(subQuestion.$type).toEqual(questionConst.questionTypes.shortText);
            });
            it('should build sub-question for Long Text List question', function () {
                isLongTextList = true;

                var subQuestion = svc.buildDefaultSubQuestionDefinition(parentQuestion, isLongTextList);

                expect(subQuestion).toBeDefined();
                expect(subQuestion.$type).toEqual(questionConst.questionTypes.longText);
                expect(subQuestion.rows).toBeDefined();
            });
        });

        describe('Testing validate function', function () {
            var question = {
                id: 1,
                optionList: {
                    options: []
                }
            };
            var validationResult;

            it('should return invalid when question has invalid options', function () {
                selectionOptionListSvc.validateOptions.and.returnValue({ valid: false });

                validationResult = svc.validate(question);

                expect(validationResult).toBeDefined();
                expect(validationResult.valid).toEqual(false);
            });

            it('should return invalid when question has invalid length-validation', function () {
                selectionOptionListSvc.validateOptions.and.returnValue({ valid: true });
                textQuestionSvc.validateCharacters.and.returnValue({ valid: false });
                question.validations = [
                {
                    $type: 'LengthValidation',
                    min: 10,
                    max: 1
                }];

                validationResult = svc.validate(question);

                expect(validationResult).toBeDefined();
                expect(validationResult.valid).toEqual(false);
            });

            it('should return invalid when question has invalid word-amount-validation', function () {
                selectionOptionListSvc.validateOptions.and.returnValue({ valid: true });
                textQuestionSvc.validateCharacters.and.returnValue({ valid: true });
                textQuestionSvc.validateWords.and.returnValue({ valid: false });
                question.validations = [
                    {
                        $type: 'LengthValidation'
                    },
                    {
                        $type: 'WordsAmountValidation',
                        min: 10,
                        max: 1
                    }
                ];

                validationResult = svc.validate(question);

                expect(validationResult).toBeDefined();
                expect(validationResult.valid).toEqual(false);
            });

            it('should return valid when short text list is valid', function () {
                selectionOptionListSvc.validateOptions.and.returnValue({ valid: true });
                textQuestionSvc.validateCharacters.and.returnValue({ valid: true });
                textQuestionSvc.validateWords.and.returnValue({ valid: true });
                question.validations = [
                    {
                        $type: 'LengthValidation'
                    },
                    {
                        $type: 'WordsAmountValidation',
                        min: 10,
                        max: 1
                    }
                ];
                question.$type = questionConst.questionTypes.shortTextList;

                validationResult = svc.validate(question);

                expect(validationResult).toBeDefined();
                expect(validationResult.valid).toEqual(true);
            });

            it('should return invalid when long text list has invalid Rows', function () {
                selectionOptionListSvc.validateOptions.and.returnValue({ valid: true });
                textQuestionSvc.validateCharacters.and.returnValue({ valid: true });
                textQuestionSvc.validateWords.and.returnValue({ valid: true });
                textQuestionSvc.validateRows.and.returnValue({ valid: false });
                question.validations = [
                    {
                        $type: 'LengthValidation'
                    },
                    {
                        $type: 'WordsAmountValidation',
                        min: 10,
                        max: 1
                    }
                ];
                question.$type = questionConst.questionTypes.longTextList;
                question.subQuestionDefinition = {
                    $type: questionConst.questionTypes.longText
                };

                validationResult = svc.validate(question);

                expect(validationResult).toBeDefined();
                expect(validationResult.valid).toEqual(false);
            });

            it('should return valid when long text list is valid', function () {
                selectionOptionListSvc.validateOptions.and.returnValue({ valid: true });
                textQuestionSvc.validateCharacters.and.returnValue({ valid: true });
                textQuestionSvc.validateWords.and.returnValue({ valid: true });
                textQuestionSvc.validateRows.and.returnValue({ valid: true });
                question.validations = [
                    {
                        $type: 'LengthValidation'
                    },
                    {
                        $type: 'WordsAmountValidation',
                        min: 10,
                        max: 1
                    }
                ];
                question.$type = questionConst.questionTypes.longTextList;
                question.subQuestionDefinition = {
                    $type: questionConst.questionTypes.longText
                };

                validationResult = svc.validate(question);

                expect(validationResult).toBeDefined();
                expect(validationResult.valid).toEqual(true);
            });
        });
    });
})();