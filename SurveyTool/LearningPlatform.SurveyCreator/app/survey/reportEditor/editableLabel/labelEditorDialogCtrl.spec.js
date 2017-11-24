(function () {
    'use stric';
    describe('Testing labelEditorDialogCtrl controller', function () {
        var scope, editor, $modalInstance, editedLabelDataSvc, errorHandlingSvc, ctrl, q;

        beforeEach(function() {
            module('svt');

            inject(function($rootScope, $controller, $q) {
                scope = $rootScope.$new();
                q = $q;

                $modalInstance = jasmine.createSpyObj('$modalInstance', ['dismiss']);
                editedLabelDataSvc = jasmine.createSpyObj('editedLabelDataSvc', ['addEditedLabel', 'updateEditedLabel']);
                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError']);
                editor = {label: {}};

                ctrl = $controller('labelEditorDialogCtrl', {
                    $scope: scope,
                    $modalInstance: $modalInstance,
                    editedLabelDataSvc: editedLabelDataSvc,
                    errorHandlingSvc: errorHandlingSvc,
                    editor: editor
                });
            });
        });

        describe('Testing cancel function', function () {
            it('should close dialog', function () {
                scope.cancel();

                expect($modalInstance.dismiss).toHaveBeenCalled();
            });
        });

        describe('Testing addEditedLabel function', function () {
            it('should return when label has invalid content', function () {
                scope.labelContent = '';

                scope.addEditedLabel();

                expect(editedLabelDataSvc.addEditedLabel).not.toHaveBeenCalled();
            });

            it('should add new label when adding success', function () {
                scope.labelContent = 'dummy';
                editedLabelDataSvc.addEditedLabel.and.returnValue({ $promise: q.when({}) });

                scope.addEditedLabel();
                scope.$digest();

                expect(editedLabelDataSvc.addEditedLabel).toHaveBeenCalled();
                expect($modalInstance.dismiss).toHaveBeenCalled();
            });

            it('should not add new label when adding fail', function () {
                scope.labelContent = 'dummy';
                editedLabelDataSvc.addEditedLabel.and.returnValue({ $promise: q.reject({}) });

                scope.addEditedLabel();
                scope.$digest();

                expect(editedLabelDataSvc.addEditedLabel).toHaveBeenCalled();
                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });

        describe('Testing updateEditedLabel function', function () {
            it('should return when label has invalid content', function () {
                scope.labelContent = '';

                scope.updateEditedLabel();

                expect(editedLabelDataSvc.updateEditedLabel).not.toHaveBeenCalled();
            });

            it('should update when updating success', function () {
                scope.labelContent = 'dummy';
                editedLabelDataSvc.updateEditedLabel.and.returnValue({ $promise: q.when({}) });

                scope.updateEditedLabel();
                scope.$digest();

                expect(editedLabelDataSvc.updateEditedLabel).toHaveBeenCalled();
                expect($modalInstance.dismiss).toHaveBeenCalled();
            });

            it('should not update when updating fail', function () {
                scope.labelContent = 'dummy';
                editedLabelDataSvc.updateEditedLabel.and.returnValue({ $promise: q.reject({}) });

                scope.updateEditedLabel();
                scope.$digest();

                expect(editedLabelDataSvc.updateEditedLabel).toHaveBeenCalled();
                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });
    });
})();