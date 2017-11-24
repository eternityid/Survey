(function() {
    describe('Testing expressionBuilderSvc service', function() {
        var svc, surveyEditorSvc, surveyEditorPageSvc, arrayUtilSvc, questionCarryOverSvc;

        beforeEach(function() {
            module('svt');
            module(function ($provide, $injector) {
                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', ['getPages']);
                surveyEditorSvc.getPages.and.returnValue([]);

                surveyEditorPageSvc = jasmine.createSpyObj('surveyEditorPageSvc', ['isThankYouPage']);
                surveyEditorPageSvc.isThankYouPage.and.callFake(function (page) {
                    return page.isThankYouPage === true;
                });

                arrayUtilSvc = jasmine.createSpyObj('arrayUtilSvc', ['hasValueIn']);
                questionCarryOverSvc = jasmine.createSpyObj('questionCarryOverSvc', ['getExpandOptions']);

                $provide.value('expressionBuilderConst', $injector.get('expressionBuilderConst'));
                $provide.value('surveyEditorSvc', surveyEditorSvc);
                $provide.value('surveyEditorPageSvc', surveyEditorPageSvc);
                $provide.value('questionConst', $injector.get('questionConst'));
                $provide.value('arrayUtilSvc', arrayUtilSvc);
                $provide.value('questionCarryOverSvc', questionCarryOverSvc);
            });

            inject(function($injector) {
                svc = $injector.get('expressionBuilderSvc');
            });
        });

        describe('Testing getExpressionItemGroupInfo function', function() {
            it('should return item group info', function () {
                var expressionItems = [{}, {}, { indent: 0}, {}],
                    expressionItemGroupPosition = 1;

                var result = svc.getExpressionItemGroupInfo(expressionItems, expressionItemGroupPosition);

                expect(result).toEqual(jasmine.any(Object));
            });
        });

        describe('Testing updateExpressionItems function', function() {
            it('should update position and logical operator for each item', function () {
                spyOn(svc, 'setupRequiredProperties');
                var expressionItems = [{ indent: 0 }, { indent: 1 }, { indent: 0 }, { indent: 1, LogicalOperator: 'Or' }, { indent: 1 }];

                svc.updateExpressionItems(expressionItems);

                expect(expressionItems[1].logicalOperator).toEqual(null);
                expect(expressionItems[4].logicalOperator).toEqual(null);
            });
        });

        describe('Testing getQuestionsForExpressionByPageId function', function() {
            it('should return question for expression by page', function() {
                var pageId = 5;
                surveyEditorSvc.getPages.and.returnValue([
                    { questionDefinitions: [{ type: 'info' }, {}, {}] },
                    { isThankYouPage: true },
                    { id: 5, questionDefinitions: [] },
                    { questionDefinitions: [] }
                ]);
                spyOn(svc, 'buildQuestionViewModelForExpression').and.callFake(function(question) {
                    return question.$type !== 'info';
                });

                var questions = svc.getQuestionsForExpressionByPageId(pageId);

                expect(questions.length).toEqual(3);
            });
        });

        describe('Testing getQuestionsForExpression function', function () {
            it('should return question for expression by parent question', function () {
                var parentQuestion = { pageId: 5 };
                surveyEditorSvc.getPages.and.returnValue([
                    { questionDefinitions: [{ type: 'info' }, {}] },
                    { isThankYouPage: true },
                    { id: 5, questionDefinitions: [] }
                ]);
                spyOn(svc, 'buildQuestionViewModelForExpression').and.callFake(function (question) {
                    return question.$type !== 'info';
                });

                var questions = svc.getQuestionsForExpression(parentQuestion);

                expect(questions.length).toEqual(2);
            });
        });

        describe('Testing buildQuestionViewModelForExpression function', function() {
            var question = {}, result;
            beforeEach(function() {
                arrayUtilSvc.hasValueIn.and.callFake(function (types, type) {
                    return types.indexOf(type) >= 0;
                });
            });

            it('should return undefined with info question', function () {
                question.$type = 'InformationDefinition';

                result = svc.buildQuestionViewModelForExpression(question);

                expect(result).toEqual(undefined);
            });

            describe('Valid question type', function () {
                beforeEach(function () {
                    question.title = {
                        items: [{}]
                    };
                });

                it('should not setup options with numeric question', function () {
                    question.$type = 'NumericQuestionDefinition';

                    result = svc.buildQuestionViewModelForExpression(question);

                    expect(result).toEqual(jasmine.any(Object));
                    expect(result.options).not.toBeDefined();
                });

                describe('Testing getQuestionOptions function', function () {
                    it('should set options as empty array', function () {
                        question.$type = 'SingleSelectionQuestionDefinition';

                        result = svc.buildQuestionViewModelForExpression(question);

                        expect(result).toEqual(jasmine.any(Object));
                        expect(result.options.length).toEqual(0);
                    });

                    it('should update options', function () {
                        question.optionList = {
                            options: [{}]
                        };
                        question.$type = 'MultipleSelectionQuestionDefinition';
                        questionCarryOverSvc.getExpandOptions.and.returnValue([{},
                            { text: { items: [{}] } }]);

                        result = svc.buildQuestionViewModelForExpression(question);

                        expect(result).toEqual(jasmine.any(Object));
                        expect(result.options.length).toBeGreaterThan(0);
                    });
                });
            });
        });

        describe('Testing getPreviousExpressionItem function', function () {
            var expressionItems = [], expressionItemPosition, previousItem;

            it('should return null with invalid data', function () {
                expressionItems = [{ indent: 0, position: 0 }, { indent: 1, position: 1 }, { indent: 1, position: 2 }];
                expressionItemPosition = 1;

                previousItem = svc.getPreviousExpressionItem(expressionItems, expressionItemPosition);

                expect(previousItem).toBeNull();
            });

            it('should return group', function() {
                expressionItems = [{ indent: 0, position: 0 }, { indent: 1, position: 1 }, { indent: 0, position: 2 }, { indent: 1, position: 3 }];
                expressionItemPosition = 2;

                previousItem = svc.getPreviousExpressionItem(expressionItems, expressionItemPosition);

                expect(previousItem.indent).toEqual(0);
            });

            it('should return item', function () {
                expressionItems = [{ indent: 0, position: 0 }, { indent: 1, position: 1 }, { indent: 1, position: 2 }];
                expressionItemPosition = 2;

                previousItem = svc.getPreviousExpressionItem(expressionItems, expressionItemPosition);

                expect(previousItem.indent).toEqual(1);
            });
        });

        describe('Testing getSelectedQuestion function', function () {
            var questions = [{ id: 1 }, { id: 2 }, { id: 3 }], questionId, question;

            it('should return question', function () {
                questionId = 3;

                question = svc.getSelectedQuestion(questions, questionId);

                expect(question).not.toBeNull();
            });

            it('should return null with invalid question id', function () {
                questionId = -1;

                question = svc.getSelectedQuestion(questions, questionId);

                expect(question).toBeNull();
            });
        });
    });
})();