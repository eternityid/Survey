(function () {
    angular
        .module('svt')
        .controller('fromLibraryDialogCtrl', FromLibraryDialogCtrl);

    FromLibraryDialogCtrl.$inject = ['$scope', '$modalInstance', 'modalData'];

    function FromLibraryDialogCtrl($scope, $modalInstance, modalData) {
        $scope.modalTitle = modalData.modalTitle || 'Add from Library';
        $scope.okTitle = modalData.okTitle || 'Add';
        $scope.cancelTitle = modalData.cancelTitle || 'Cancel';

        $scope.importItem = importItem;
        $scope.cancel = cancel;

        init();

        function init() {
            $scope.isImportedPage = false;
            $scope.selectedPageIds = [];
            $scope.selectedQuestionIds = [];
            $scope.libraryId = null;
        }

        function importItem() {
            var result = {
                isImportedPage: $scope.isImportedPage,
                libraryId: $scope.libraryId,
                selectedPageIds: $scope.selectedPageIds,
                selectedQuestionIds: $scope.selectedQuestionIds
            };

            $modalInstance.close({ data: result });
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }
})();