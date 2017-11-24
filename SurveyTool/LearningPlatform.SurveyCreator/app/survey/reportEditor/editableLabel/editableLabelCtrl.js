(function() {
    angular.module('svt').controller('editableLabelCtrl', editableLabelCtrl);

    editableLabelCtrl.$inject = [
        '$scope', '$modal'
    ];

    function editableLabelCtrl($scope, $modal) {
        var vm = this;
        vm.openDialog = openDialog;

        function openDialog() {
            vm.editor = {
                label: $scope.label
            };
            $modal.open({
                templateUrl: 'survey/reportEditor/editableLabel/label-editor-dialog.html',
                controller: 'labelEditorDialogCtrl',
                windowClass: 'center-modal',
                resolve: {
                    editor: function () {
                        return vm.editor;
                    }
                }
            });
        }
    }
})();