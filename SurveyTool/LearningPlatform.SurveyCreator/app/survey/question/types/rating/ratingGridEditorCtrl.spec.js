(function () {
    'use strict';
    describe('Testing rating grid editor question controller', function () {
        var ctrl, scope, arrayUtilSvc, selectionOptionListSvc, guidUtilSvc,
        questionPreviewerSvc, ratingQuestionSvc;

        beforeEach(function () {
            module('svt');

            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();

                scope.question = { optionList: { options: []}};

                arrayUtilSvc = jasmine.createSpyObj('arrayUtilSvc', ['isArrayHasElement']);
                arrayUtilSvc.isArrayHasElement.and.returnValue(false);

                selectionOptionListSvc = jasmine.createSpyObj('selectionOptionListSvc', ['buildDefaultOptions', 'validateOptions']);
                selectionOptionListSvc.buildDefaultOptions.and.returnValue([{
                    optionsMask: { questionId: 1 },
                    text: {
                        items: [{text:'Topic 1'}]
                    }
                }]);

                guidUtilSvc = jasmine.createSpyObj('guidUtilSvc', ['createGuid']);

                questionPreviewerSvc = jasmine.createSpyObj('questionPreviewerSvc', ['getUpdatingCommandTypes', 'addReloadCommand', 'addOrUpdateUpdatingCommand']);
                questionPreviewerSvc.getUpdatingCommandTypes.and.returnValue({ ratingGrid: {} });

                ratingQuestionSvc = jasmine.createSpyObj('ratingQuestionSvc', ['getSteps', 'buildDefaultSubQuestionDefinition', 'buildOptionsBasedOnExistedOptions', 'buildOptions']);
                ratingQuestionSvc.buildDefaultSubQuestionDefinition.and.returnValue({
                    optionList: {
                        options: []
                    }
                });

                ctrl = $controller('ratingGridEditorCtrl', {
                    $scope: scope,
                    arrayUtilSvc: arrayUtilSvc,
                    selectionOptionListSvc: selectionOptionListSvc,
                    guidUtilSvc: guidUtilSvc,
                    questionPreviewerSvc: questionPreviewerSvc,
                    ratingQuestionSvc: ratingQuestionSvc
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

        describe('Testing getDisplayNameShape function', function () {
            it('should return shape name', function () {
                var shapeName = ctrl.getDisplayNameShape();
                expect(shapeName).toBeDefined();
            });

            it('should return heart shape name', function () {
                scope.question.subQuestionDefinition.shapeName = 'glyphicon glyphicon-heart';
                var shapeName = ctrl.getDisplayNameShape();
                expect(shapeName).toBeDefined();
            });

            it('should return star shape name', function () {
                scope.question.subQuestionDefinition.shapeName = 'glyphicon glyphicon-star';
                var shapeName = ctrl.getDisplayNameShape();
                expect(shapeName).toBeDefined();
            });
        });

        describe('Testing onShapeChange function', function () {
            it('should live update shape name', function () {
                var shape = { value: 'dummy' };
                ctrl.onShapeChange(shape);

                expect(scope.question.subQuestionDefinition.shapeName).toEqual(shape.value);
                expect(questionPreviewerSvc.addOrUpdateUpdatingCommand).toHaveBeenCalled();
            });
        });

        describe('Testing onStepChange function', function () {
            it('should live update step', function () {
                ctrl.onStepChange();

                expect(questionPreviewerSvc.addOrUpdateUpdatingCommand).toHaveBeenCalled();
            });
        });
    });
})();