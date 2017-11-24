(function () {
    'use strict';

    angular
        .module('svt')
        .controller('deleteGroupHeaderDialogCtrl', deleteGroupHeaderDialogCtrl);

    deleteGroupHeaderDialogCtrl.$inject = ['$scope', '$modalInstance', 'modalData'];

    function deleteGroupHeaderDialogCtrl($scope, $modalInstance, modalData) {
        $scope.modalTitle = 'Delete Group Header Confirmation';
        $scope.message = 'Do you want to delete all the options in this group?';
        $scope.deleteGroupHeaderText = 'Delete just Group Header';
        $scope.deleteGroupHeaderCompleteText = 'Delete this Group completely';
        $scope.cancelTitle = 'Cancel';
        $scope.isAlowDeleteGroupComplete = modalData.isAlowDeleteGroupComplete;

        $scope.deleteGroupHeader = deleteGroupHeader;
        $scope.deleteGroupHeaderComplete = deleteGroupHeaderComplete;
        $scope.cancel = cancel;

        function deleteGroupHeader() {
            $modalInstance.close({ status: 'justDeleteGroupHeader' });
        }

        function deleteGroupHeaderComplete() {
            $modalInstance.close({ status: 'deleteThisGroupHeaderComplete' });
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }
})();
