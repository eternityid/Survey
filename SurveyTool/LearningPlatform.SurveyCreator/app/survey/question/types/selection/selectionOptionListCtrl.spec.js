(function () {
    'use strict';
    describe('Testing selectionOptionListCtrl controller', function () {
        var ctrl,
            scope,
            timeout,
            arrayUtilSvc,
            $modal,
            domUtilSvc,
            selectionOptionListSvc,
            questionPreviewerSvc,
            moveOptionSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $injector) {
                scope = $rootScope.$new();
                scope.question = { optionList: { options: []} };
                scope.optionList = { optionGroups: [{}], options: [{}] };
                scope.displayLogic = {};
                scope.validateOptions = jasmine.createSpy('validateOptions');
                scope.previewQuestion = { optionList: { options: [], optionGroups: [] } };

                timeout = jasmine.createSpy('$timeout');
                arrayUtilSvc = $injector.get('arrayUtilSvc');
                $modal = jasmine.createSpyObj('modal', ['open']);
                domUtilSvc = jasmine.createSpyObj('domUtilSvc', ['selectElementContent']);

                selectionOptionListSvc = jasmine.createSpyObj('selectionOptionListSvc', [
                    'canAddNewOption',
                    'buildNewOptionBasedOnExistedOptions', 'buildDefaultOtherQuestionDefinition',
                    'sortOptionGroups', 'buildOptionListForMovingOptions'
                ]);
                selectionOptionListSvc.sortOptionGroups.and.returnValue(scope.optionList.optionGroups);
                selectionOptionListSvc.buildOptionListForMovingOptions.and.returnValue(scope.optionList);

                questionPreviewerSvc = jasmine.createSpyObj('questionPreviewerSvc', ['addReloadCommand']);
                moveOptionSvc = jasmine.createSpyObj('moveOptionSvc', [
                    'moveOptionToAnotherOptionGroup', 'moveOptionInsideOptionGroup']);

                ctrl = $controller('selectionOptionListCtrl', {
                    $scope: scope,
                    $timeout: timeout,
                    arrayUtilSvc: arrayUtilSvc,
                    domUtilSvc: domUtilSvc,
                    $modal: $modal,
                    selectionOptionListSvc: selectionOptionListSvc,
                    questionPreviewerSvc: questionPreviewerSvc,
                    moveOptionSvc: moveOptionSvc
                });
            });
        });

        describe('Testing controller properties', function () {
            it('should define required properties', function () {
                expect(ctrl.optionList).toBeDefined();
                expect(ctrl.sortableOptions).toBeDefined();
                expect(ctrl.sortableOptions.containment).toEqual('showQuestionType');
                expect(ctrl.isSingleSelectionType).toBeDefined();
                expect(ctrl.optionTypes).toBeDefined();
            });
        });

        describe('Testing sortableOptions.orderChanged function', function () {
            it('should update question previewer', function () {
                var event = {
                    dest: { sortableScope: { $parent: { modelValue: { alias: 'alias' } }, modelValue: [] } },
                    source: { itemScope: { modelValue: {} } }
                };
                scope.question.optionList.options = [];

                ctrl.sortableOptions.orderChanged(event);
                scope.$digest();

                expect(questionPreviewerSvc.addReloadCommand).toHaveBeenCalled();
            });
        });

        describe('Testing sortableOptions.accept function', function () {
            var sourceItemScope = { itemScope: { modelValue: {} } },
                sortableScope = { $id: 1 },
                destScope = null,
                result;

            it('shoult return true when moving option', function () {
                sourceItemScope.itemScope.modelValue.$type = 'Option';

                result = ctrl.sortableOptions.accept(sourceItemScope, sortableScope, destScope);

                expect(result).toEqual(true);
            });

            it('shoult return true when moving option group', function () {
                sourceItemScope.itemScope.modelValue.$type = 'OptionGroup';

                result = ctrl.sortableOptions.accept(sourceItemScope, sortableScope, destScope);

                expect(result).toEqual(true);
            });
        });

        describe('Testing addOption function', function () {
            var optionType;

            it('should not add option when option list is overload', function () {
                scope.displayLogic.maximumOfOptions = 1;
                scope.optionList.options = [{}];

                ctrl.addOption(optionType);

                expect(selectionOptionListSvc.buildNewOptionBasedOnExistedOptions).not.toHaveBeenCalled();
            });

            it('should add new option with other answer', function () {
                optionType = ctrl.optionTypes.optionHasOtherQuestion;
                selectionOptionListSvc.buildNewOptionBasedOnExistedOptions.and.returnValue({});
                selectionOptionListSvc.buildDefaultOtherQuestionDefinition.and.returnValue({});
                selectionOptionListSvc.canAddNewOption.and.returnValue(true);
                ctrl.addOption(optionType);

                expect(selectionOptionListSvc.buildDefaultOtherQuestionDefinition).toHaveBeenCalled();
                scope.$digest();
                expect(questionPreviewerSvc.addReloadCommand).toHaveBeenCalled();
            });

            it('should add carry over option', function () {
                optionType = ctrl.optionTypes.carryOverOption;
                selectionOptionListSvc.buildNewOptionBasedOnExistedOptions.and.returnValue({
                    text: { items: [{ text: '' }] },
                    guid: ''
                });
                selectionOptionListSvc.canAddNewOption.and.returnValue(true);
                scope.openningOption = {};

                ctrl.addOption(optionType);
                expect(scope.openningOption.guid).toBeDefined();
            });

            it('should add normal option', function () {
                optionType = ctrl.optionTypes.normalOption;
                selectionOptionListSvc.buildNewOptionBasedOnExistedOptions.and.returnValue({});
                selectionOptionListSvc.canAddNewOption.and.returnValue(true);

                ctrl.addOption(optionType);
                scope.$digest();
                expect(questionPreviewerSvc.addReloadCommand).toHaveBeenCalled();
            });
        });

        describe('Testing onKeyDownOnOptionAliasField function', function () {
            var $event = {}, option = {};

            it('should not handle ignored key', function () {
                $event.which = 1;

                ctrl.onKeyDownOnOptionAliasField($event, option);

                expect(domUtilSvc.selectElementContent).not.toHaveBeenCalled();
            });

            it('should go to previous option when pressing UP or SHIFT + TAB keys', function () {
                $event.which = 38;
                option.alias = 'q1';

                ctrl.optionList.options = [{}, {}];
                ctrl.optionList.options.push(option);
                ctrl.onKeyDownOnOptionAliasField($event, option);

                $event.which = 9;
                option.alias = 'q2';
                $event.shiftKey = true;
                ctrl.onKeyDownOnOptionAliasField($event, option);

                expect(timeout.calls.count()).toEqual(2);
            });

            it('should add new option when pressing ENTER key on the last option', function () {
                $event.which = 13;
                option.alias = 'q2';
                spyOn(ctrl, 'addOption');
                ctrl.optionList.options = [{}, {}];
                ctrl.optionList.options.push(option);

                ctrl.onKeyDownOnOptionAliasField($event, option);

                expect(ctrl.addOption).toHaveBeenCalled();
            });

            it('should go to next option when pressing DOWN or TAB keys', function () {
                $event.which = 40;
                option.alias = 'q1';

                ctrl.optionList.options = [{}, {}, {}];

                ctrl.onKeyDownOnOptionAliasField($event, option);

                $event.which = 9;
                option.alias = 'q1';
                $event.shiftKey = false;
                ctrl.onKeyDownOnOptionAliasField($event, option);

                expect(timeout.calls.count()).toEqual(2);
            });
        });

        describe('Testing isOverloadedOptions function', function () {
            var result;

            it('should return true when options are overloaded', function () {
                scope.displayLogic.maximumOfOptions = 2;
                ctrl.optionList.options = [{}, {}];

                result = ctrl.isOverloadedOptions();

                expect(result).toEqual(true);
            });

            it('should return false when options are not overloaded', function () {
                scope.displayLogic.maximumOfOptions = 10;
                ctrl.optionList.options = [{}];

                result = ctrl.isOverloadedOptions();

                expect(result).toEqual(false);
            });
        });
    });
})();