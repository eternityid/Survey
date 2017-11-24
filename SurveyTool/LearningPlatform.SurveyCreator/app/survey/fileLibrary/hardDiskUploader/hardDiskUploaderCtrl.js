(function () {
    angular
        .module('svt')
        .controller('hardDiskUploaderCtrl', HardDiskUploaderCtrl);

    HardDiskUploaderCtrl.$inject = [
        '$scope', 'fileLibraryConstants', 'fileLibraryHardDiskUploaderSvc',
        'angularScopeUtilSvc', 'fileUtilSvc', 'stringUtilSvc', 'domUtilSvc'
    ];

    function HardDiskUploaderCtrl(
        $scope, fileLibraryConstants, fileLibraryHardDiskUploaderSvc,
        angularScopeUtilSvc, fileUtilSvc, stringUtilSvc, domUtilSvc) {

        var vm = this;
        vm.onChangeFile = onChangeFile;
        vm.onChangeFolder = onChangeFolder;
        vm.onAddFile = onAddFile;

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
                    $scope.model.directory = getDefaultFolderName();
                }
            });

            function getDefaultFolderName() {
                return vm.selectedLibrary.directories.length > 0 ?
                    vm.selectedLibrary.directories[0].name : fileLibraryConstants.DEFAULT_FOLDER;
            }
        }

        function onChangeFile(fileEvent, errorMessageValue) {
            if (fileEvent !== null) {
                $scope.model.fileNameWithoutExtension = fileUtilSvc.getFileNameWithoutExtensionFromPath(fileEvent.name, '/');
                $scope.model.file.result = (fileEvent && fileEvent.target) ? fileEvent.target.result: '';

                angularScopeUtilSvc.safeDigest($scope);
                return;
            }

            $scope.model.file = null;
            angularScopeUtilSvc.safeDigest($scope);
            if (errorMessageValue && errorMessageValue.key !== fileLibraryConstants.INVALID_FILE.IS_NOT_EXISTS.key) {
                toastr.error(errorMessageValue.value);
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