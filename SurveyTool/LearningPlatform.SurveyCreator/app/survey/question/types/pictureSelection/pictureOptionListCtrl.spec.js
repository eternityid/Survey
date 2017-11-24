(function () {
    describe('Testing pictureOptionListCtrl controller', function () {
        var ctrl,
            $scope,
            timeout,
            settingConst,
            pictureOptionListSvc,
            questionPreviewerSvc,
            domUtilSvc;

        beforeEach(function () {
            module('svt');

            inject(function ($rootScope, $controller, $injector, $timeout) {
                $scope = $rootScope.$new();
                $scope.options = [];
                $scope.question = {};

                timeout = $timeout;
                settingConst = $injector.get('settingConst');

                pictureOptionListSvc = jasmine.createSpyObj('pictureOptionListSvc', [
                    'buildNewOptionBasedOnExistedOptions'
                ]);

                questionPreviewerSvc = jasmine.createSpyObj('questionPreviewerSvc', ['addReloadCommand']);
                domUtilSvc = jasmine.createSpyObj('domUtilSvc', ['selectElementContent']);

                ctrl = $controller('pictureOptionListCtrl', {
                    $scope: $scope,
                    $timeout: timeout,
                    settingConst: settingConst,
                    pictureOptionListSvc: pictureOptionListSvc,
                    questionPreviewerSvc: questionPreviewerSvc,
                    domUtilSvc: domUtilSvc
                });
            });
        });

        describe('Testing controller properties', function () {
            it('should work about drag and drop', function () {
                ctrl.sortableOptions.itemMoved();

                $scope.options = [{}, {}];
                ctrl.sortableOptions.orderChanged();
                expect(questionPreviewerSvc.addReloadCommand).toHaveBeenCalled();

                var sourceItemHandleScope = { itemScope: { option: {}, $parent: { $id: 'dummy' } } },
                    sortableScope = { $id: 'dummy' },
                    result;

                result = ctrl.sortableOptions.accept(sourceItemHandleScope, sortableScope);
                expect(result).toEqual(true);
            });
        });

        describe('Testing addOption function', function () {
            it('should not permit to add more than maximum options', function () {
                ctrl.options = [];
                for (var i = 0; i < settingConst.picture.maxOption; i++) {
                    ctrl.options.push({});
                }

                ctrl.addOption();

                expect(pictureOptionListSvc.buildNewOptionBasedOnExistedOptions).not.toHaveBeenCalled();
            });

            it('should add option', function () {
                var length = ctrl.options.length;
                pictureOptionListSvc.buildNewOptionBasedOnExistedOptions.and.returnValue({});

                ctrl.addOption();
                timeout.flush();

                expect(pictureOptionListSvc.buildNewOptionBasedOnExistedOptions).toHaveBeenCalled();
                expect(ctrl.options.length).toEqual(length + 1);
            });
        });

        describe('Testing onKeyDownOnOptionAliasField function', function () {
            var $event = {},
                optionIndex;

            it('should not process uncaught key', function () {
                $event.which = 8;

                ctrl.onKeyDownOnOptionAliasField($event, optionIndex);

                expect(domUtilSvc.selectElementContent).not.toHaveBeenCalled();
            });

            it('should jump to previous option', function () {
                $event.which = 38;
                ctrl.options = [{ guid: '1' }, { guid: '2' }];

                optionIndex = '0';
                ctrl.onKeyDownOnOptionAliasField($event, optionIndex);
                expect(domUtilSvc.selectElementContent).not.toHaveBeenCalled();

                $event.which = 9;
                $event.shiftKey = true;
                optionIndex = '1';
                ctrl.onKeyDownOnOptionAliasField($event, optionIndex);
                timeout.flush();
                expect(domUtilSvc.selectElementContent).toHaveBeenCalledWith('1');
            });

            it('should jump to next option', function () {
                $event.which = 13;
                optionIndex = '0';
                ctrl.options = [{ guid: '1' }, { guid: '2' }];

                ctrl.onKeyDownOnOptionAliasField($event, optionIndex);
                timeout.flush();

                expect(domUtilSvc.selectElementContent).toHaveBeenCalledWith('2');
            });

            it('should add new option', function () {
                spyOn(ctrl, 'addOption');
                $event.which = 9;
                $event.shiftKey = false;
                ctrl.options = [{ guid: '1' }, { guid: '2' }];
                optionIndex = '1';

                ctrl.onKeyDownOnOptionAliasField($event, optionIndex);

                expect(ctrl.addOption).toHaveBeenCalled();
            });
        });

        describe('Testing isOverloadedOptions function', function () {
            var result;

            it('should return true', function () {
                ctrl.options = [];
                for (var i = 0; i < settingConst.picture.maxOption + 1; i++) {
                    ctrl.options.push({});
                }

                result = ctrl.isOverloadedOptions();

                expect(result).toEqual(true);
            });
        });
    });
})();