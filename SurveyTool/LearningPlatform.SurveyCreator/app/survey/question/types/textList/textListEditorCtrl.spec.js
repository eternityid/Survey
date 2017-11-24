(function () {
    describe('Testing textListEditorCtrl controller', function () {
        var ctrl, scope, arrayUtilSvc, guidUtilSvc,
            textListQuestionSvc, selectionOptionListSvc, questionPreviewerSvc;

        beforeEach(function () {
            module('svt');

            inject(function ($rootScope, $controller, $injector) {
                scope = $rootScope.$new();
                scope.question = {
                    $type: 'LongTextListQuestionDefinition',
                    advancedSettings: {},
                    optionList: {
                        options: [
                            { optionsMask: { questionId: 1 }, text: { items: [{ text: '' }] } },
                            { guid: 'dummy', text: { items: [{ text: '' }] } }
                        ]
                    }
                };

                arrayUtilSvc = jasmine.createSpyObj('arrayUtilSvc', ['isArrayHasElement']);
                arrayUtilSvc.isArrayHasElement.and.callFake(function (array) {
                    return array.length > 0;
                });

                guidUtilSvc = jasmine.createSpyObj('guidUtilSvc', ['createGuid']);
                textListQuestionSvc = jasmine.createSpyObj('textListQuestionSvc', [
                    'buildDefaultSubQuestionDefinition']);

                selectionOptionListSvc = jasmine.createSpyObj('selectionOptionListSvc', [
                    'buildDefaultOptions', 'validateOptions']);

                questionPreviewerSvc = jasmine.createSpyObj('questionPreviewerSvc', [
                    'getUpdatingCommandTypes', 'addReloadCommand', 'addOrUpdateUpdatingCommand']);
                questionPreviewerSvc.getUpdatingCommandTypes.and.returnValue({ textList: {} });

                ctrl = $controller('textListEditorCtrl', {
                    $scope: scope,
                    arrayUtilSvc: arrayUtilSvc,
                    guidUtilSvc: guidUtilSvc,
                    textListQuestionSvc: textListQuestionSvc,
                    selectionOptionListSvc: selectionOptionListSvc,
                    questionPreviewerSvc: questionPreviewerSvc
                });
            });
        });

        describe('Testing controller properties', function () {
            it('should define required properties', function () {
                expect(ctrl.openningOption).toBeDefined();
                expect(ctrl.displayLogic).toBeDefined();
            });
        });

        describe('Testing init function', function () {
            it('should call default functions', function () {
                expect(questionPreviewerSvc.getUpdatingCommandTypes).toHaveBeenCalled();
                expect(questionPreviewerSvc.addReloadCommand).toHaveBeenCalled();
            });

            it('should not re setup sub question when it exists', function () {
                scope.question.optionList.options = [];
                scope.question.subQuestionDefinition = {};
                selectionOptionListSvc.buildDefaultOptions.and.returnValue([]);
                var count = textListQuestionSvc.buildDefaultSubQuestionDefinition.calls.count();

                ctrl.init();

                expect(textListQuestionSvc.buildDefaultSubQuestionDefinition.calls.count()).toEqual(count);
            });
        });

        describe('Testing onOptionTitleChange function', function () {
            it('should update question previewer', function () {
                ctrl.onOptionTitleChange();

                expect(questionPreviewerSvc.addOrUpdateUpdatingCommand).toHaveBeenCalled();
            });
        });
    });
})();