(function () {
    angular
        .module('svt')
        .controller('webUploaderCtrl', WebUploaderCtrl);

    WebUploaderCtrl.$inject = [
        '$scope', 'stringUtilSvc', 'fileUtilSvc', 'fileLibraryWebUploaderSvc',
        'fileLibraryConstants'
    ];

    function WebUploaderCtrl(
        $scope, stringUtilSvc, fileUtilSvc, fileLibraryWebUploaderSvc,
        fileLibraryConstants) {

        var vm = this;
        vm.onChangeUri = onChangeUri;
        vm.onUploadWebFile = onUploadWebFile;
        vm.onChangeLibrary = onChangeLibrary;
        vm.onChangeDirectory = onChangeDirectory;

        init();

        function init() {
            $scope.$watch('library', function (newValue, oldValue) {
                vm.selectedLibrary = $scope.library;

                if (newValue !== oldValue || stringUtilSvc.isEmpty($scope.model.directory)) {
                    $scope.model.directory = getDefaultFolderName();
                }
            });

            function getDefaultFolderName() {
                return vm.selectedLibrary.directories.length > 0 ?
                    vm.selectedLibrary.directories[0].name : fileLibraryConstants.DEFAULT_FOLDER;
            }
        }

        function onChangeUri() {
            if (stringUtilSvc.isEmpty($scope.model.sourceUri) ||
                stringUtilSvc.isNotEmpty($scope.model.fileNameWithoutExtension)) return;
            $scope.model.fileNameWithoutExtension = fileUtilSvc.getFileNameWithoutExtensionFromPath(
                $scope.model.sourceUri, '/');
        }

        function onChangeLibrary(library) {
            vm.selectedLibrary = library;
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