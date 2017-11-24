(function () {
    'use trict';

    angular
        .module('svt')
        .controller('createDirectoryModalCtrl', createDirectoryModalCtrl);

    createDirectoryModalCtrl.$inject = [
        '$scope', '$modalInstance', 'modalData',
        'fileLibraryDataSvc', 'spinnerUtilSvc'
    ];

    function createDirectoryModalCtrl($scope, $modalInstance, modalData,
        fileLibraryDataSvc, spinnerUtilSvc) {
        $scope.invalidCharacters = ['\\', '/', ':', '*', '?', '"', '\'', '<', '>', '|'];
        $scope.helperMessage = 'A folder name can not contain any of the following characters: ' +
            $scope.invalidCharacters.join(' ');
        $scope.directoryName = null;

        $scope.cancel = cancel;
        $scope.saveDirectory = saveDirectory;
        $scope.onInputDirectoryName = onInputDirectoryName;

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        function saveDirectory() {
            if (!validateDirectoryName()) {
                toastr.error('Invalid folder name. ' + $scope.helperMessage);
                return;
            }
            var isDuplicatedDirectoryName = modalData.directoryNames.some(function (directoryName) {
                return directoryName === $scope.directoryName.trim().toLowerCase();
            });
            if (isDuplicatedDirectoryName) {
                toastr.error('This folder name have already existed.');
                return;
            }

            spinnerUtilSvc.showSpinner();
            fileLibraryDataSvc.addDirectory($scope.directoryName).$promise.then(function (directory) {
                $modalInstance.close(directory);
                spinnerUtilSvc.hideSpinner();
            }, function () {
                toastr.error('Adding folder was not successful');
                spinnerUtilSvc.hideSpinner();
            });
        }

        function onInputDirectoryName(event) {
            if ($scope.invalidCharacters.indexOf(event.key) >= 0) event.preventDefault();
        }

        function validateDirectoryName() {
            if (!$scope.directoryName) return false;

            return !$scope.invalidCharacters.some(function (invalidCharacter) {
                return $scope.directoryName.includes(invalidCharacter);
            });
        }
    }
})();