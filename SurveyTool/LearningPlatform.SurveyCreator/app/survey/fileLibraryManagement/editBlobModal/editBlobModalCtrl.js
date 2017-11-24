(function () {
    'use trict';

    angular
        .module('svt')
        .controller('editBlobModalCtrl', editBlobModalCtrl);

    editBlobModalCtrl.$inject = [
        '$scope', '$modalInstance', 'modalData',
        'fileLibraryDataSvc', 'spinnerUtilSvc'
    ];

    function editBlobModalCtrl($scope, $modalInstance, modalData,
        fileLibraryDataSvc, spinnerUtilSvc) {
        $scope.modalData = modalData;
        $scope.selectedDirectoryName = modalData.blob.directory;

        $scope.cancel = cancel;
        $scope.saveBlob = saveBlob;
        $scope.onChangeDirectory = onChangeDirectory;

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        function saveBlob() {
            spinnerUtilSvc.showSpinner();
            fileLibraryDataSvc.updateBlob(modalData.blob, $scope.selectedDirectoryName).$promise.then(function (newBlob) {
                $modalInstance.close(newBlob);
                spinnerUtilSvc.hideSpinner();
            }, function () {
                toastr.error('Updating file was not successful');
                spinnerUtilSvc.hideSpinner();
            });
        }

        function onChangeDirectory(directory) {
            $scope.selectedDirectoryName = directory.name;
        }
    }
})();