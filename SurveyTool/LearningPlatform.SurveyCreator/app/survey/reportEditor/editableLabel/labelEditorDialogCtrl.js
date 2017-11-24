(function () {
    angular.module('svt').controller('labelEditorDialogCtrl', labelEditorDialogCtrl);

    labelEditorDialogCtrl.$inject = [
        '$scope', 'editor', '$modalInstance', 'editedLabelDataSvc', 'errorHandlingSvc'
    ];

    function labelEditorDialogCtrl($scope, editor, $modalInstance, editedLabelDataSvc, errorHandlingSvc) {
        $scope.labelContent = editor.label.latestContent;
        $scope.editor = editor;

        $scope.validationMessageForLabelContent = '';

        $scope.cancel = cancel;
        $scope.addEditedLabel = addEditedLabel;
        $scope.updateEditedLabel = updateEditedLabel;
        $scope.onLatestTextKeyPress = onLatestTextKeyPress;

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        function addEditedLabel() {
            if (!valiteLabelContent()) return;

            var messageForAddingLabel = {
                fail: 'Adding label was not successful.'
            };

            editedLabelDataSvc.addEditedLabel(setupEditedLabelForEditMode()).$promise.then(function (label) {
                populateLabel(label);
                cancel();
            }, function (error) {
                errorHandlingSvc.manifestError(messageForAddingLabel.fail, error);
            });
        }

        function updateEditedLabel() {
            if (!valiteLabelContent()) return;

            var messageForEditingLabel = {
                fail: 'Updating label was not successful.'
            };

            editedLabelDataSvc.updateEditedLabel(setupEditedLabelForEditMode()).$promise.then(function (label) {
                populateLabel(label);
                cancel();
            }, function (error) {
                errorHandlingSvc.manifestError(messageForEditingLabel.fail, error);
            });
        }

        function setupEditedLabelForEditMode() {
            var label = angular.copy($scope.editor.label);
            label.latestContent = $scope.labelContent;

            return label;
        }

        function populateLabel(label) {
            $scope.editor.label.latestContent = label.latestContent;
            if (!$scope.editor.label.id) $scope.editor.label.id = label.id;
            if (!$scope.editor.label.isChanged) $scope.editor.label.isChanged = true;
        }

        function valiteLabelContent() {
            if ($scope.labelContent.length <= 0) {
                $scope.validationMessageForLabelContent = 'Can not save empty field. Please write some content.';
                return false;
            }
            return true;
        }

        function onLatestTextKeyPress(event) {
            if (event.which === 13) {
                if ($scope.editor.label.id) $scope.updateEditedLabel();
                else $scope.addEditedLabel();
                event.preventDefault();
            }
        }

    }
})();