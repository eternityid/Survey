(function () {
    'use strict';
    describe('Testing selectionGridEditorCtrl controller', function () {
        var ctrl,
            scope,
            arrayUtilSvc,
            guidUtilSvc,
            selectionGridQuestionSvc,
            selectionOptionListSvc,
            questionPreviewerSvc,
            questionCarryOverSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $injector) {
                scope = $rootScope.$new();
                scope.question = {
                    advancedSettings: {},
                    optionList: {
                        options: [{}, {}]
                    },
                    subQuestionDefinition: {
                        optionList: {
                            options: [{}, {}]
                        }
                    }
                };
                scope.validateOptions = jasmine.createSpy('validateOptions');

                arrayUtilSvc = $injector.get('arrayUtilSvc');
                guidUtilSvc = jasmine.createSpyObj('guidUtilSvc', ['createGuid']);

                selectionGridQuestionSvc = jasmine.createSpyObj('selectionGridQuestionSvc', [
                    'buildDefaultSubQuestionDefinition'
                ]);

                selectionOptionListSvc = jasmine.createSpyObj('selectionOptionListSvc', [
                    'validateOptions', 'buildDefaultOptions'
                ]);

                questionPreviewerSvc = jasmine.createSpyObj('questionPreviewerSvc', [
                    'getUpdatingCommandTypes', 'addReloadCommand', 'addOrUpdateUpdatingCommand']);
                questionPreviewerSvc.getUpdatingCommandTypes.and.returnValue({ selectionGrid: {} });

                questionCarryOverSvc = jasmine.createSpyObj('questionCarryOverSvc', ['getExpandOptions']);

                ctrl = $controller('selectionGridEditorCtrl', {
                    $scope: scope,
                    arrayUtilSvc: arrayUtilSvc,
                    guidUtilSvc: guidUtilSvc,
                    selectionGridQuestionSvc: selectionGridQuestionSvc,
                    selectionOptionListSvc: selectionOptionListSvc,
                    questionPreviewerSvc: questionPreviewerSvc,
                    questionCarryOverSvc: questionCarryOverSvc
                });
            });
        });

        describe('Testing controller properties', function () {
            it('should define required properties and initialize data', function () {
                expect(ctrl.openningOption).toBeDefined();
                expect(ctrl.displayLogicForTopics).toBeDefined();
                expect(ctrl.displayLogicForOptions).toBeDefined();

                expect(questionPreviewerSvc.getUpdatingCommandTypes).toHaveBeenCalled();
            });
        });

        describe('Testing init function', function () {
            it('should call default functions', function () {
                expect(questionPreviewerSvc.addReloadCommand).toHaveBeenCalled();
            });

            it('should setup option list when option list does not have option', function () {
                scope.question.optionList.options = [];
                selectionOptionListSvc.buildDefaultOptions.and.returnValue([{}, { optionsMask: { questionId: 1 } }]);

                ctrl.init();

                expect(selectionOptionListSvc.buildDefaultOptions).toHaveBeenCalled();
            });

            it('should build default sub question when it does not exist', function () {
                scope.question.subQuestionDefinition = null;
                selectionGridQuestionSvc.buildDefaultSubQuestionDefinition.and.returnValue(
                    { optionList: { options: [{ optionsMask: { questionId: 1 } }] } });

                ctrl.init();

                expect(selectionGridQuestionSvc.buildDefaultSubQuestionDefinition).toHaveBeenCalled();
            });
        });

        describe('Testing onOptionTitleChange function', function () {
            it('should update question previewer', function () {
                questionCarryOverSvc.getExpandOptions.and.returnValue([{ text: { items: [{ text: '' }] } }]);

                ctrl.onOptionTitleChange();

                expect(questionPreviewerSvc.addOrUpdateUpdatingCommand).toHaveBeenCalled();
            });
        });
    });
})();