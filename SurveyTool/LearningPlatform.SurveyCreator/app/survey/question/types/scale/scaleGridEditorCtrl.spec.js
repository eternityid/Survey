(function () {
    'use strict';
    describe('Testing scale grid editor question controller', function () {
        var ctrl, scope, arrayUtilSvc, selectionOptionListSvc, guidUtilSvc,
        questionPreviewerSvc, scaleQuestionSvc, surveyEditorSvc;

        beforeEach(function () {
            module('svt');

            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();

                scope.question = {
                    advancedSettings: false
                };

                arrayUtilSvc = jasmine.createSpyObj('arrayUtilSvc', ['isArrayHasElement']);
                arrayUtilSvc.isArrayHasElement.and.returnValue(false);

                selectionOptionListSvc = jasmine.createSpyObj('selectionOptionListSvc', [
                    'buildDefaultOptions', 'validateOptions']);
                selectionOptionListSvc.buildDefaultOptions.and.returnValue([{
                    optionsMask: { questionId: 1 },
                    text: {
                        items: [{ text: 'Topic 1' }]
                    }
                }]);

                guidUtilSvc = jasmine.createSpyObj('guidUtilSvc', ['createGuid']);

                questionPreviewerSvc = jasmine.createSpyObj('questionPreviewerSvc', [
                    'getUpdatingCommandTypes', 'addReloadCommand', 'addOrUpdateUpdatingCommand']);
                questionPreviewerSvc.getUpdatingCommandTypes.and.returnValue({ scaleGrid: {} });

                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', [
                    'getSurvey', 'getSvtPlaceholderRespondentItems']);

                scaleQuestionSvc = jasmine.createSpyObj('scaleQuestionSvc', [
                    'getScoreByOptionList', 'buildDefaultSubQuestionDefinition', 'validate',
                    'buildOptionsBasedOnExistedOptions', 'buildOptions']);
                var builtSubQuestion = {
                    optionList: {
                        options: []
                    },
                    likertLeftText: {
                        items: [{}]
                    },
                    likertCenterText: {
                        items: [{}]
                    },
                    likertRightText: {
                        items: [{}]
                    }
                };
                scaleQuestionSvc.getScoreByOptionList.and.returnValue({});
                scaleQuestionSvc.buildDefaultSubQuestionDefinition.and.returnValue(builtSubQuestion);
                scaleQuestionSvc.validate.and.returnValue({ valid: true });
                scaleQuestionSvc.buildOptionsBasedOnExistedOptions.and.returnValue([{ id: 1 }]);
                scaleQuestionSvc.buildOptions.and.returnValue([{ id: 2 }]);

                ctrl = $controller('scaleGridEditorCtrl', {
                    $scope: scope,
                    arrayUtilSvc: arrayUtilSvc,
                    selectionOptionListSvc: selectionOptionListSvc,
                    guidUtilSvc: guidUtilSvc,
                    questionPreviewerSvc: questionPreviewerSvc,
                    scaleQuestionSvc: scaleQuestionSvc,
                    surveyEditorSvc: surveyEditorSvc
                });
                scope.$digest();
            });
        });

        describe('Testing init function', function () {
            it('should setup properties', function () {
                expect(scope.question.optionList.options.length).toBeGreaterThan(0);
                expect(scope.question.subQuestionDefinition).toBeDefined();
                expect(questionPreviewerSvc.addReloadCommand).toHaveBeenCalled();
            });
        });

        describe('Testing onTopicTitleChange function', function () {
            it('should live update topic title', function () {
                ctrl.onTopicTitleChange();
                expect(questionPreviewerSvc.addOrUpdateUpdatingCommand).toHaveBeenCalled();
            });
        });

        describe('Testing onScoreChange function', function () {
            it('should live update score', function () {
                ctrl.onScoreChange();
                expect(questionPreviewerSvc.addReloadCommand).toHaveBeenCalled();
            });
        });

        describe('Testing onLikertTextChange function', function () {
            it('should live update likert text', function () {
                ctrl.onLikertTextChange();
                expect(questionPreviewerSvc.addOrUpdateUpdatingCommand).toHaveBeenCalled();
            });
        });
    });
})();