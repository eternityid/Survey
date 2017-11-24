(function () {
    'use strict';
    describe('Testing skipCommandSvc service', function () {
        var svc, settingConst, expressionBuilderSvc, skipCommandEditorSvc, questionTypeSvc, arrayUtilSvc,
            surveyEditorSvc, stringUtilSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                expressionBuilderSvc = jasmine.createSpyObj('expressionBuilderSvc', [
                    'getPreviousExpressionItem', 'getQuestionsForExpressionByPageId',
                    'getSelectedQuestion', 'isErrorExpressionItem']);

                skipCommandEditorSvc = jasmine.createSpyObj('skipCommandEditorSvc', ['renderOperatorStringForDisplay']);

                questionTypeSvc = jasmine.createSpyObj('questionTypeSvc', ['isQuestionTypeHasOptions']);

                arrayUtilSvc = jasmine.createSpyObj('arrayUtilSvc', ['hasValueIn']);

                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', ['getData']);

                stringUtilSvc = jasmine.createSpyObj('stringUtilSvc', ['getPlainText', 'truncateByCharAmount']);


                $provide.value('expressionBuilderSvc', expressionBuilderSvc);
                $provide.value('skipCommandEditorSvc', skipCommandEditorSvc);
                $provide.value('questionTypeSvc', questionTypeSvc);
                $provide.value('arrayUtilSvc', arrayUtilSvc);
                $provide.value('surveyEditorSvc', surveyEditorSvc);
                $provide.value('stringUtilSvc', stringUtilSvc);
            });
            inject(function($injector) {
                svc = $injector.get('skipCommandSvc');
                settingConst = $injector.get('settingConst');
            });
        });

        describe('Testing getDisplayedExpressionItems function', function () {
            it('should return null when expression item list is empty or invalid', function () {
                var result = svc.getDisplayedExpressionItems();

                expect(result).toEqual(null);
            });

            describe('Should return expression  message when expression item list is valid', function() {
                it('should handle epxression item is group expression item', function () {
                    var result = null;
                    var expressionItems = [{ indent: 0 }];

                    result = svc.getDisplayedExpressionItems(expressionItems);

                    expect(result).not.toEqual(null);
                });

                it('should handle epxression item is conditional expression item', function () {
                    var result = null;
                    var expressionItems = [{ indent: 1, questionId: 1 }];
                    expressionBuilderSvc.getSelectedQuestion.and.returnValue({});
                    surveyEditorSvc.getData.and.returnValue({optionTitlesInSurvey: []});

                    result = svc.getDisplayedExpressionItems(expressionItems);

                    expect(result).not.toEqual(null);
                });
            });
        });

    });
})();