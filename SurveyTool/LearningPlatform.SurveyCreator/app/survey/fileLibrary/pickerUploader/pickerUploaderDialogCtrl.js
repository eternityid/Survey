(function () {
    angular
        .module('svt')
        .controller('pickerUploaderDialogCtrl', PickerUploaderDialogCtrl);

    PickerUploaderDialogCtrl.$inject = [
        '$scope', '$modalInstance', 'modalData', 'fileLibraryDataSvc',
        'spinnerUtilSvc'
    ];

    function PickerUploaderDialogCtrl(
        $scope, $modalInstance, modalData, fileLibraryDataSvc,
        spinnerUtilSvc
        ) {
        var vm = this;

        $scope.modalTitle = modalData.modalTitle || 'Upload File';
        $scope.okTitle = modalData.okTitle || 'Add';
        $scope.cancelTitle = modalData.cancelTitle || 'Cancel';

        $scope.blob = {};
        $scope.webUploaderFormData = {
            directory: modalData.selectedFolderName || null,
            description: null,
            fileNameWithoutExtension: null,
            sourceUri: null
        };
        $scope.hardDriveUploaderFormData = {
            directory: modalData.selectedFolderName || null,
            description: null,
            file: null
        };

        $scope.displayMode = {
            fromHardDrive: true,
            fromInternet: false
        };

        $scope.onCancel = onCancel;
        $scope.onUploadFileFromHardDrive = onUploadFileFromHardDrive;
        $scope.onUploadFileFromInternet = onUploadFileFromInternet;

        vm.model = {
            fromHardDrive: {
                file: null,
                fileList: null,
                fileNameWithoutExtension: '',
                directory: '',
                description: ''
            },
            fromWeb: {
                sourceUri: '',
                fileNameWithoutExtension: '',
                directory: '',
                description: ''
            }
        };

        vm.fileConfig = modalData.config;
        vm.libraries = modalData.libraries;
        vm.selectedLibrary = modalData.selectedLibrary;
        vm.displayFromHardDrive = displayFromHardDrive;
        vm.displayFromInternet = displayFromInternet;

        function onCancel() {
            $modalInstance.dismiss('cancel');
        }

        function onUploadFileFromHardDrive() {
            spinnerUtilSvc.showSpinner();
            vm.model.fromHardDrive.library = vm.selectedLibrary.name;
            fileLibraryDataSvc.uploadHardDriveFile(vm.model.fromHardDrive).$promise.then(function (blob) {
                $modalInstance.close(blob);
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                toastr.error('Upload file was not successful');
                spinnerUtilSvc.hideSpinner();
            });
        }

        function onUploadFileFromInternet() {
            spinnerUtilSvc.showSpinner();
            vm.model.fromWeb.library = vm.selectedLibrary.name;
            fileLibraryDataSvc.uploadBlobViaSourceUri(vm.model.fromWeb).$promise.then(function (blob) {
                $modalInstance.close(blob);
                spinnerUtilSvc.hideSpinner();
            }, function () {
                toastr.error('Uploading file was not successful. Please try another file!');
                spinnerUtilSvc.hideSpinner();
            });
        }

        function displayFromHardDrive() {
            $scope.displayMode.fromHardDrive = true;
            $scope.displayMode.fromInternet = false;
        }

        function displayFromInternet() {
            $scope.displayMode.fromHardDrive = false;
            $scope.displayMode.fromInternet = true;
        }
    }
})();