(function () {
    angular
        .module('svt')
        .controller('fileLibraryPickerUploaderDialogCtrl', FileLibraryPickerUploaderDialogCtrl);

    FileLibraryPickerUploaderDialogCtrl.$inject = [
        '$rootScope', '$scope', '$filter', '$modalInstance', 'modalData', 'fileLibraryDataSvc', 'spinnerUtilSvc',
        'fileLibrarySvc', 'libraryConst', 'fileLibraryPickerUploaderDialogSvc',
        'fileLibraryConstants', 'libraryImagePreviewerSvc'
    ];

    function FileLibraryPickerUploaderDialogCtrl(
        $rootScope, $scope, $filter, $modalInstance, modalData, fileLibraryDataSvc, spinnerUtilSvc,
        fileLibrarySvc, libraryConst, fileLibraryPickerUploaderDialogSvc,
        fileLibraryConstants, libraryImagePreviewerSvc
        ) {
        var vm = this;

        $scope.modalTitle = modalData.modalTitle || 'File Library Picker';
        $scope.okTitle = modalData.okTitle || 'Add';
        $scope.cancelTitle = modalData.cancelTitle || 'Cancel';

        $scope.webUploaderFormData = {
            library: null,
            directory: null,
            description: null,
            fileNameWithoutExtension: null,
            sourceUri: null
        };
        $scope.hardDriveUploaderFormData = {
            directory: null,
            description: null,
            file: null
        };

        vm.displayModes = fileLibraryConstants.PICKER_UPLOADER_DISPLAY_MODES;
        vm.displayMode = vm.displayModes.fromLibrary;

        $scope.onCancel = onCancel;
        $scope.onSelectFileFromLibrary = onSelectFileFromLibrary;
        $scope.onUploadFileFromHardDrive = onUploadFileFromHardDrive;
        $scope.onUploadFileFromInternet = onUploadFileFromInternet;

        vm.model = {
            fromLibrary: {
                fileLibraryFilter: '',
                selectedDirectoryName: '',
                originalImageUrl: modalData.imageUrl,
                imageSize: {}
            },
            fromHardDrive: {
                file: null,
                fileList: null,
                imageData: null,
                fileNameWithoutExtension: '',
                directory: '',
                description: '',
                imageSize: {}
            },
            fromWeb: {
                sourceUri: '',
                fileNameWithoutExtension: '',
                directory: '',
                description: '',
                imageSize: {}
            }
        };

        vm.fileConfig = modalData.config; //TODO move in into vm.model.fromHardDrive and vm.model.fromWeb
        vm.imageUrl = modalData.imageUrl; //TODO should move it inside vm.model.fromLibrary

        vm.onSwitchTab = onSwitchTab;
        vm.onLibraryChange = onLibraryChange;

        init();

        function init() {
            spinnerUtilSvc.showSpinner();
            fileLibraryDataSvc.getFilesLibrary().$promise.then(function (result) {
                spinnerUtilSvc.hideSpinner();
                vm.libraries = [];
                if (result.hasOwnProperty('systemLibrary') && result.systemLibrary) {
                    vm.libraries.push(result.systemLibrary);
                }
                if (result.hasOwnProperty('userLibrary') && result.userLibrary) {
                    vm.libraries.push(result.userLibrary);
                }

                var index = fileLibraryPickerUploaderDialogSvc.getLibraryIndexByBlobUrl(
                    vm.libraries, modalData.imageUrl);
                vm.selectedLibrary = vm.libraries[index < 0 ? 0 : index];
                vm.latestPickerLibrary = angular.copy(vm.selectedLibrary);
            }, function () {
                toastr.error('Getting libraries was not successful');
                spinnerUtilSvc.hideSpinner();
            });
        }

        function onCancel() {
            $modalInstance.dismiss('cancel');
        }

        function onSelectFileFromLibrary() {
            var uri = libraryImagePreviewerSvc.parseImageUrlWithParameters(
                vm.imageUrl, vm.model.fromLibrary.imageSize, vm.fileConfig.allowChangeImageDimension);
            $modalInstance.close({ uri: uri });
        }

        function onUploadFileFromHardDrive() {
            spinnerUtilSvc.showSpinner();
            fileLibraryDataSvc.uploadHardDriveFile(vm.model.fromHardDrive).$promise.then(function (blob) {
                var uri = libraryImagePreviewerSvc.parseImageUrlWithParameters(
                    blob.uri, vm.model.fromHardDrive.imageSize, vm.fileConfig.allowChangeImageDimension);

                $modalInstance.close({ uri: uri });
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                toastr.error('Upload file was not successful');
                spinnerUtilSvc.hideSpinner();
            });
        }

        function onUploadFileFromInternet() {
            spinnerUtilSvc.showSpinner();
            fileLibraryDataSvc.uploadBlobViaSourceUri(vm.model.fromWeb).$promise.then(function (blob) {
                var uri = libraryImagePreviewerSvc.parseImageUrlWithParameters(
                    blob.uri, vm.model.fromWeb.imageSize, vm.fileConfig.allowChangeImageDimension);

                $modalInstance.close({ uri: uri });
                spinnerUtilSvc.hideSpinner();
            }, function () {
                toastr.error('Uploading file was not successful. Please try another file!');
                spinnerUtilSvc.hideSpinner();
            });
        }

        function onSwitchTab(mode) {
            vm.displayMode = mode;
            if (vm.displayMode === vm.displayModes.fromLibrary) {
                if (vm.latestPickerLibrary.type === libraryConst.libraryTypes.system) {
                    for (var i = 0; i < vm.libraries.length; i++) {
                        if (vm.libraries[i].uri === vm.latestPickerLibrary.uri) {
                            vm.selectedLibrary = vm.libraries[i];
                            vm.latestPickerLibrary = angular.copy(vm.selectedLibrary);
                            break;
                        }
                    }
                }
            } else {
                var validSelectedLibrary = vm.libraries.some(function (library) {
                    return vm.selectedLibrary.uri === library.uri &&
                        library.type === libraryConst.libraryTypes.user;
                });
                if (!validSelectedLibrary) {
                    vm.selectedLibrary = vm.libraries.filter(function (library) {
                        return library.type === libraryConst.libraryTypes.user;
                    })[0];
                }
            }
        }

        function onLibraryChange() {
            if (vm.displayMode === vm.displayModes.fromLibrary) {
                vm.latestPickerLibrary = angular.copy(vm.selectedLibrary);
            }
        }
    }
})();