(function () {
    'use strict';

    angular
        .module('svt')
        .controller('deleteDialogCtrl', deleteDialogCtrl);

    deleteDialogCtrl.$inject = ['$scope', '$modalInstance', 'modalData'];

    function deleteDialogCtrl($scope, $modalInstance, modalData) {
        $scope.modalTitle = modalData.modalTitle || 'Delete Confirmation';
        $scope.message = modalData.message;
        $scope.okTitle = modalData.okTitle || 'Delete';
        $scope.cancelTitle = modalData.cancelTitle || 'Cancel';

        $scope.deleteItem = deleteItem;
        $scope.cancel = cancel;

        function deleteItem(result) {
            $modalInstance.close({ status: result });
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }
})();