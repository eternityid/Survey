(function () {
    describe('Testing expressionItemCtrl controller', function () {
        var ctrl, $scope, settingConst, expressionBuilderSvc, questionTypeSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $injector) {
                $scope = $rootScope.$new();
                $scope.item = {};
                $scope.builder = {
                    operators: {
                        forNumericQuestion: [{ value: 'GreaterThan' }, { value: 'LessThan' }],
                        forSelectionQuestion: [{ value: 'IsSelected' }, { value: 'IsNotSelected' }],
                        forOpenTextQuestion: [{ value: 'Contain' }, { value: 'Contain' }]
                    }
                };

                settingConst = $injector.get('settingConst');
                expressionBuilderSvc = jasmine.createSpyObj('expressionBuilderSvc', [
                    'getSelectedQuestion'
                ]);

                questionTypeSvc = jasmine.createSpyObj('questionTypeSvc', [
                    'isQuestionTypeHasOptions', 'isQuestionTypeNPSLikertRating']);
                arrayUtilSvc = jasmine.createSpyObj('arrayUtilSvc', [
                    'getItem', 'hasValueIn']);
                arrayUtilSvc.hasValueIn.and.callFake(function (array, item) {
                    return array.indexOf(item) >= 0;
                });

                ctrl = $controller('expressionItemCtrl', {
                    $scope: $scope,
                    settingConst: settingConst,
                    expressionBuilderSvc: expressionBuilderSvc,
                    questionTypeSvc: questionTypeSvc,
                    arrayUtilSvc: arrayUtilSvc
                });
            });
        });

        describe('Testing init function', function () {
            it('should setup expression item with defined expression', function () {
                spyOn(ctrl, 'onQuestionChange');
                $scope.item.questionId = 1;

                ctrl.init();

                expect(ctrl.onQuestionChange).toHaveBeenCalled();
            });
        });

        describe('Testing onQuestionChange function', function () {
            var expressionItem = {}, isByChangeType;

            it('should do nothing when cannot get selected question', function () {
                $scope.item.selectedQuestion = { dummy: 'dummy' };
                expressionBuilderSvc.getSelectedQuestion.and.returnValue(undefined);

                ctrl.onQuestionChange(expressionItem, isByChangeType);

                expect($scope.item.selectedQuestion).toEqual({ dummy: 'dummy' });
            });

            describe('Have selected question', function () {
                beforeEach(function () {
                    expressionBuilderSvc.getSelectedQuestion.and.returnValue({});
                    $scope.item.operator = 'dummy';
                    $scope.item.value = 'dummy';
                });

                it('should not change operator and value when do not change question type', function () {
                    isByChangeType = false;

                    ctrl.onQuestionChange(expressionItem, isByChangeType);

                    expect($scope.item.operator).toEqual('dummy');
                    expect($scope.item.value).toEqual('dummy');
                });

                describe('Question has options', function () {
                    beforeEach(function () {
                        isByChangeType = true;
                        questionTypeSvc.isQuestionTypeHasOptions.and.returnValue(true);
                    });

                    it('should set operator and value for expression with rating question', function () {
                        expressionBuilderSvc.getSelectedQuestion.and.returnValue({
                            questionType: 'RatingQuestionDefinition',
                            options: [{ id: 1, text: 'Option 1' }]
                        });
                        questionTypeSvc.isQuestionTypeNPSLikertRating.and.returnValue(true);

                        ctrl.onQuestionChange(expressionItem, isByChangeType);

                        expect($scope.item.operator).toEqual('GreaterThan');
                        expect($scope.item.value).toEqual('Option 1');
                    });

                    it('should set operator for expression with single selection question', function () {
                        expressionBuilderSvc.getSelectedQuestion.and.returnValue({
                            questionType: 'SingleSelectionQuestionDefinition',
                            options: [{ id: 1, text: 'Option 1' }]
                        });
                        questionTypeSvc.isQuestionTypeNPSLikertRating.and.returnValue(false);

                        ctrl.onQuestionChange(expressionItem, isByChangeType);

                        expect($scope.item.operator).toEqual('IsSelected');
                    });
                });

                describe('Question does not have options', function () {
                    beforeEach(function () {
                        isByChangeType = true;
                        questionTypeSvc.isQuestionTypeHasOptions.and.returnValue(false);
                    });

                    it('should set operator and value for expression with numeric question', function () {
                        expressionBuilderSvc.getSelectedQuestion.and.returnValue({
                            questionType: 'NumericQuestionDefinition'
                        });

                        ctrl.onQuestionChange(expressionItem, isByChangeType);

                        expect($scope.item.operator).toEqual('GreaterThan');
                        expect($scope.item.value).toEqual('');
                    });

                    it('should set operator and value for expression with short text question', function () {
                        expressionBuilderSvc.getSelectedQuestion.and.returnValue({
                            questionType: 'OpenEndedShortTextQuestionDefinition'
                        });

                        ctrl.onQuestionChange(expressionItem, isByChangeType);

                        expect($scope.item.operator).toEqual('Contain');
                        expect($scope.item.value).toEqual('');
                    });
                });
            });
        });

        describe('Testing onOptionValueChange function', function () {
            it('should set option id for expression', function () {
                var result, value = 'dummy option';
                $scope.item.selectedQuestion = { id: 1, options: [{ id: 2 }] };
                arrayUtilSvc.getItem.and.returnValue({ id: 2 });
                $scope.item.optionId = undefined;

                result = ctrl.onOptionValueChange(value);

                expect($scope.item.optionId).not.toEqual(undefined);
            });
        });
    });
})();