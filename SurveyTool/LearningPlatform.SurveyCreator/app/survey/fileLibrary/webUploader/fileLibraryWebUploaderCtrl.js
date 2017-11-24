(function () {
    angular
        .module('svt')
        .controller('fileLibraryWebUploaderCtrl', FileLibraryWebUploaderCtrl);

    FileLibraryWebUploaderCtrl.$inject = [
        '$scope', 'stringUtilSvc', 'fileUtilSvc', 'fileLibraryWebUploaderSvc',
        'fileLibraryConstants', 'libraryConst', 'fileLibrarySvc', 'angularScopeUtilSvc'
    ];

    function FileLibraryWebUploaderCtrl(
        $scope, stringUtilSvc, fileUtilSvc, fileLibraryWebUploaderSvc,
        fileLibraryConstants, libraryConst, fileLibrarySvc, angularScopeUtilSvc) {
        var vm = this;

        vm.onChangeUri = onChangeUri;
        vm.onUploadWebFile = onUploadWebFile;
        vm.onChangeDirectory = onChangeDirectory;

        init();

        function init() {
            $scope.$watch('library', function (newValue, oldValue) {
                vm.selectedLibrary = $scope.library;
                if (newValue !== oldValue || stringUtilSvc.isEmpty($scope.model.directory)) {
                    $scope.model.directory = vm.selectedLibrary.directories.length > 0 ?
                        vm.selectedLibrary.directories[0].name : fileLibraryConstants.DEFAULT_FOLDER;
                }
            });
        }

        function onChangeUri() {
            if (stringUtilSvc.isNotEmpty($scope.model.sourceUri) &&
                stringUtilSvc.isEmpty($scope.model.fileNameWithoutExtension)) {
                $scope.model.fileNameWithoutExtension = fileUtilSvc.getFileNameWithoutExtensionFromPath(
                    $scope.model.sourceUri, '/');
            }
            angularScopeUtilSvc.safeApply($scope);
        }

        function onChangeDirectory(directory) {
            $scope.model.directory = directory.name;
        }

        function onUploadWebFile() {
            if (!fileLibraryWebUploaderSvc.validateFile($scope.model)) return;
            $scope.onSave();
        }
    }
})();