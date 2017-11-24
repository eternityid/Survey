(function () {
    describe('Testing pictureOptionCtrl controller', function () {
        var ctrl,
            scope,
            questionPreviewerSvc,
            pictureOptionListSvc,
            $modal;

        beforeEach(function () {
            module('svt');

            inject(function ($rootScope, $controller, $injector) {
                scope = $rootScope.$new();
                scope.index = 0;
                scope.options = [{}];
                scope.openningOption = {};

                questionPreviewerSvc = jasmine.createSpyObj('questionPreviewerSvc', [
                    'getUpdatingCommandTypes', 'addReloadCommand', 'addOrUpdateUpdatingCommand']);
                questionPreviewerSvc.getUpdatingCommandTypes.and.returnValue({ pictureSelection: {} });

                pictureOptionListSvc = jasmine.createSpyObj('pictureOptionListSvc', [
                    'validateOptionTitles', 'validateOptionAliases']);

                $modal = jasmine.createSpyObj('$modal', ['open']);

                ctrl = $controller('pictureOptionCtrl', {
                    $scope: scope,
                    questionPreviewerSvc: questionPreviewerSvc,
                    pictureOptionListSvc: pictureOptionListSvc,
                    $modal: $modal
                });
            });
        });

        describe('Testing isOpenning function', function () {
            var result;

            it('should return true when option is openned', function () {
                ctrl.option.guid = 'temp1';
                scope.openningOption.guid = 'temp1';

                result = ctrl.isOpenning();

                expect(result).toEqual(true);
            });
        });

        describe('Testing canBeDeleted function', function () {
            var result;

            it('should permit to delete one of multiple options', function () {
                scope.options = [{}, {}];

                result = ctrl.canBeDeleted();

                expect(result).toEqual(true);
            });
        });

        describe('Testing onClickToggleIcon function', function () {
            it('should set the guid of openning option to null', function () {
                spyOn(ctrl, 'isOpenning').and.returnValue(true);

                ctrl.onClickToggleIcon();

                expect(scope.openningOption.guid).toEqual(null);
            });

            it('should keep the guid of closing option', function () {
                spyOn(ctrl, 'isOpenning').and.returnValue(false);
                ctrl.option.guid = 'dummy';

                ctrl.onClickToggleIcon();

                expect(scope.openningOption.guid).not.toEqual(null);
            });
        });

        describe('Testing onPictureChange function', function () {
            var params = { uri: 'dummy/dummy.jpg' };

            it('should update questionn previewer', function () {
                ctrl.onPictureChange(params);

                expect(questionPreviewerSvc.addReloadCommand).toHaveBeenCalled();
            });
        });

        describe('Testing getOriginPictureName function', function () {
            var result;

            it('should return the actual picture name', function () {
                ctrl.option.pictureName = 'dummy_123';

                result = ctrl.getOriginPictureName();

                expect(result).toEqual('123');
            });

            it('should return empty string with invalid picture name', function () {
                ctrl.option.pictureName = 'dummy';

                result = ctrl.getOriginPictureName();

                expect(result).toEqual('');
            });
        });

        describe('Testing onOptionTitleChange function', function () {
            beforeEach(function () {
                scope.question = {
                    optionList: {
                        options: [{ text: { items: [{ text: 'dummy' }] } }]
                    }
                };
                spyOn(toastr, 'warning');
                spyOn(toastr, 'error');
            });

            it('should permit to change when option title is valid', function () {
                pictureOptionListSvc.validateOptionTitles.and.returnValue({ valid: true });

                ctrl.onOptionTitleChange();

                expect(questionPreviewerSvc.addOrUpdateUpdatingCommand).toHaveBeenCalled();

                expect(toastr.warning).not.toHaveBeenCalled();
                expect(toastr.error).not.toHaveBeenCalled();
            });

            it('should show warning message when title is invalid but permit to save', function () {
                pictureOptionListSvc.validateOptionTitles.and.returnValue({ valid: true, message: 'dummy' });

                ctrl.onOptionTitleChange();

                expect(toastr.warning).toHaveBeenCalled();
            });

            it('should show error message when not permit to save invalid title', function () {
                pictureOptionListSvc.validateOptionTitles.and.returnValue({ valid: false });

                ctrl.onOptionTitleChange();

                expect(toastr.error).toHaveBeenCalled();
            });
        });

        describe('Testing onOptionAliasChange function', function () {
            beforeEach(function () {
                scope.question = {
                    optionList: {
                        options: []
                    }
                };
                spyOn(toastr, 'error');
            });

            it('should permit to change with valid option alias', function () {
                pictureOptionListSvc.validateOptionAliases.and.returnValue({ valid: true });

                ctrl.onOptionAliasChange();

                expect(toastr.error).not.toHaveBeenCalled();
            });

            it('should show error message with invalid option title', function () {
                pictureOptionListSvc.validateOptionAliases.and.returnValue({ valid: false });

                ctrl.onOptionAliasChange();

                expect(toastr.error).toHaveBeenCalled();
            });
        });

        describe('Testing onRemoveOption function', function () {
            it('should update question previewer', function () {
                scope.options = [{}, {}, {}];
                scope.index = 1;

                ctrl.onRemoveOption();

                expect(questionPreviewerSvc.addReloadCommand).toHaveBeenCalled();
            });
        });
    });
})();