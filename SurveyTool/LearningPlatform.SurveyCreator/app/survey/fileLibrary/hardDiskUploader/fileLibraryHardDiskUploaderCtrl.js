(function () {
    angular
        .module('svt')
        .controller('fileLibraryHardDiskUploaderCtrl', FileLibraryHardDiskUploaderCtrl);

    FileLibraryHardDiskUploaderCtrl.$inject = [
        '$scope', 'fileLibraryConstants', 'fileLibraryHardDiskUploaderSvc', 'libraryConst',
        'fileLibrarySvc', 'fileUtilSvc', 'stringUtilSvc', 'domUtilSvc'
    ];

    function FileLibraryHardDiskUploaderCtrl(
        $scope, fileLibraryConstants, fileLibraryHardDiskUploaderSvc, libraryConst,
        fileLibrarySvc, fileUtilSvc, stringUtilSvc, domUtilSvc) {

        var vm = this;
        vm.onChangeFile = onChangeFile;
        vm.onChangeFolder = onChangeFolder;
        vm.onAddFile = onAddFile;
        vm.getImageWidth = fileLibrarySvc.getImageWidth;
        vm.getImageHeight = fileLibrarySvc.getImageHeight;

        onInit();

        function onInit() {
            if (!$scope.config.hasOwnProperty('acceptMimeTypes')) {
                $scope.config.acceptMimeTypes = fileLibraryConstants.IMAGE_MIME_TYPES;
            }
            vm.acceptFileTypes = $scope.config.acceptMimeTypes.join(',');

            if ($scope.model.file) {
                domUtilSvc.setFileListIntoDom('hard-drive-uploader-file', $scope.model.fileList);
            }

            $scope.$watch('library', function (newValue, oldValue) {
                vm.selectedLibrary = newValue;
                if (newValue !== oldValue || stringUtilSvc.isEmpty($scope.model.directory)) {
                    $scope.model.directory = vm.selectedLibrary.directories.length > 0 ?
                                                vm.selectedLibrary.directories[0].name :
                                                fileLibraryConstants.DEFAULT_FOLDER;
                }
            });
        }

        function onChangeFile(fileEvent, errorMessageValue) {
            if (fileEvent !== null) {
                var srcFileValue = fileEvent && fileEvent.target ? fileEvent.target.result : '';
                $scope.model.fileNameWithoutExtension = fileUtilSvc.getFileNameWithoutExtensionFromPath(fileEvent.name, '/');

                $scope.$apply(function () {
                    $scope.model.imageData = srcFileValue;
                });
            } else {
                $scope.model.file = null;
                $scope.$apply(function () {
                    $scope.model.imageData = null;
                });
                if (errorMessageValue && errorMessageValue.key !== fileLibraryConstants.INVALID_FILE.IS_NOT_EXISTS.key) {
                    toastr.error(errorMessageValue.value);
                }
            }
        }

        function onChangeFolder(selectedFolder) {
            $scope.model.directory = selectedFolder.name;
        }

        function onAddFile() {
            var hardDriveFileValidation = fileLibraryHardDiskUploaderSvc.validate($scope.model, $scope.config);
            if (hardDriveFileValidation) {
                toastr.error(hardDriveFileValidation.value);
                return;
            }
            $scope.onSave();
        }
    }
})();