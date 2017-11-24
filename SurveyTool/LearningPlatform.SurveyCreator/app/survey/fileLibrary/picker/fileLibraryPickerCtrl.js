(function () {
    angular
        .module('svt')
        .controller('fileLibraryPickerCtrl', FileLibraryPickerCtrl);

    FileLibraryPickerCtrl.$inject = [
        '$scope', 'libraryConst', 'fileLibrarySvc', 'angularScopeUtilSvc',
        'fileLibraryPickerSvc'
    ];

    function FileLibraryPickerCtrl(
        $scope, libraryConst, fileLibrarySvc, angularScopeUtilSvc,
        fileLibraryPickerSvc) {
        var selectedImageUrlOrg = angular.copy($scope.selectedImageUrl);

        var vm = this;
        vm.directoryNames = [];
        vm.selectBlob = selectBlob;

        init();

        function init() {
            vm.activeBlob = $scope.selectedImageUrl ?
                fileLibraryPickerSvc.getBlobByUri($scope.library.directories, $scope.selectedImageUrl) :
                null;
            if ($scope.model.originalImageUrl &&
                $scope.model.originalImageUrl === $scope.selectedImageUrl &&
                !$scope.model.imageSize.hasOwnProperty('width') &&
                !$scope.model.imageSize.hasOwnProperty('height')) {
                fileLibraryPickerSvc.syncImageSize($scope.model.imageSize, $scope.selectedImageUrl);
            }

            $scope.$watch('library', function () {
                onChangeLibrary();
            });
        }

        function onChangeLibrary() {
            var libraryDirectoryNames = $scope.library.directories.map(function (directory) {
                return directory.name;
            });
            libraryDirectoryNames.unshift('all');
            angular.copy(libraryDirectoryNames, vm.directoryNames);

            var index;
            if (vm.activeBlob) {
                index = libraryDirectoryNames.indexOf(vm.activeBlob.directory);
            }

            if (index < 0 || index === undefined) index = 0;
            $scope.model.selectedDirectoryName = libraryDirectoryNames[index];
        }

        function selectBlob(blob) {
            vm.activeBlob = blob;

            $scope.selectedImageUrl = blob.uri;
            if ($scope.model.originalImageUrl && $scope.model.originalImageUrl.indexOf(blob.uri) === 0) {
                $scope.selectedImageUrl = $scope.model.originalImageUrl;
            }

            fileLibraryPickerSvc.syncImageSize($scope.model.imageSize, $scope.selectedImageUrl);
        }
    }
})();