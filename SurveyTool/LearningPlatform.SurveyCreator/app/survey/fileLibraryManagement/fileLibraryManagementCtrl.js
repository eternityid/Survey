(function () {
    'use trict';

    angular
        .module('svt')
        .controller('fileLibraryManagementCtrl', fileLibraryManagementCtrl);

    fileLibraryManagementCtrl.$inject = [
        'surveyMenuSvc', 'fileLibraryDataSvc', 'spinnerUtilSvc',
        '$modal', 'fileLibraryConstants', 'fileLibraryManagementSvc'
    ];

    function fileLibraryManagementCtrl(surveyMenuSvc, fileLibraryDataSvc, spinnerUtilSvc,
        $modal, fileLibraryConstants, fileLibraryManagementSvc) {
        var vm = this;

        vm.fileLibraries = [];
        vm.selectFileLibrary = null;
        vm.selectedDirectory = null;
        vm.directoryMap = {};

        vm.selectDirectory = selectDirectory;
        vm.displayAllBlobs = displayAllBlobs;
        vm.editBlob = editBlob;
        vm.deleteBlob = deleteBlob;
        vm.onFileLibraryChange = onFileLibraryChange;
        vm.pickImageFile = pickImageFile;
        vm.onCreateDirectory = onCreateDirectory;

        init();

        function init() {
            surveyMenuSvc.updateMenuForFileLibrary();
            loadFileLibraries();
        }

        function loadFileLibraries() {
            spinnerUtilSvc.showSpinner();
            fileLibraryDataSvc.getUserFileLibraries().$promise.then(function (result) {
                vm.fileLibraries.push(result);
                vm.selectFileLibrary = vm.fileLibraries[0];
                buildDirectoryMap();
                displayAllBlobs();
                spinnerUtilSvc.hideSpinner();
            }, function () {
                toastr.error('Getting file libraries was not successful');
                spinnerUtilSvc.hideSpinner();
            });
        }

        function onFileLibraryChange() {
            buildDirectoryMap();
            displayAllBlobs();
        }

        function buildDirectoryMap() {
            vm.directoryMap = {};
            vm.selectFileLibrary.directories.forEach(function (directory) {
                vm.directoryMap[directory.name] = directory;
            });
        }

        function displayAllBlobs() {
            vm.selectedDirectory = {
                name: null,
                blobs: []
            };

            vm.selectFileLibrary.directories.forEach(function (directory) {
                vm.selectedDirectory.blobs.push.apply(vm.selectedDirectory.blobs, directory.blobs);
            });
        }

        function selectDirectory(directory) {
            vm.selectedDirectory = directory;
        }

        function editBlob(blob) {
            $modal.open({
                templateUrl: 'survey/fileLibraryManagement/editBlobModal/edit-blob-modal.html',
                controller: 'editBlobModalCtrl',
                windowClass: 'center-modal edit-blob-modal',
                resolve: {
                    modalData: function () {
                        return {
                            directories: vm.selectFileLibrary.directories,
                            blob: angular.copy(blob)
                        };
                    }
                }
            }).result.then(function (modifiedBlob) {
                if (!modifiedBlob) return;
                if (modifiedBlob.uri === blob.uri) {
                    angular.copy(modifiedBlob, blob);
                    return;
                }
                if (vm.selectedDirectory.name) {
                    deleteBlobOutOfDirectory(vm.selectedDirectory, blob);
                } else {
                    var originalDirectory = vm.directoryMap[blob.directory];
                    deleteBlobOutOfDirectory(originalDirectory, blob);
                    angular.copy(modifiedBlob, blob);
                }
                var newDirectory = vm.directoryMap[modifiedBlob.directory];
                if (newDirectory) {
                    fileLibraryManagementSvc.insertBlobToDirectory(newDirectory, modifiedBlob);
                } else {
                    newDirectory = {
                        name: modifiedBlob.directory,
                        blobs: [modifiedBlob]
                    };
                    vm.selectFileLibrary.directories.push(newDirectory);
                    vm.directoryMap[newDirectory.name] = newDirectory;
                }
                vm.selectedDirectory = newDirectory;
            });
        }

        function deleteBlob(blob) {
            $modal.open({
                templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                controller: 'deleteDialogCtrl',
                windowClass: 'center-modal',
                resolve: {
                    modalData: function () {
                        return {
                            message: 'Do you want to delete the <strong>"' + blob.fileName + '"</strong> file?'
                        };
                    }
                }
            }).result.then(function (result) {
                if (!result.status) return;
                spinnerUtilSvc.showSpinner();
                fileLibraryDataSvc.deleteBlob(blob).$promise.then(function () {
                    //Delete file out of parent folder
                    var parentDirectory = vm.directoryMap[blob.directory];
                    deleteBlobOutOfDirectory(parentDirectory, blob);
                    //Delete file out of display all mode
                    if (!vm.selectedDirectory.name) deleteBlobOutOfDirectory(vm.selectedDirectory, blob);

                    spinnerUtilSvc.hideSpinner();
                }, function () {
                    spinnerUtilSvc.hideSpinner();
                });
            });
        }

        function deleteBlobOutOfDirectory(directory, blob) {
            if (!directory) return;
            directory.blobs = directory.blobs.filter(function (item) {
                return item.uri !== blob.uri;
            });
        }

        function pickImageFile() {
            $modal.open({
                templateUrl: 'survey/fileLibrary/pickerUploader/picker-uploader-dialog.html',
                controller: 'pickerUploaderDialogCtrl as vm',
                size: 'lg',
                windowClass: 'center-modal file-library',
                backdrop: 'static',
                resolve: {
                    modalData: function () {
                        return {
                            config: {
                                maxFileSize: 5 * 1024 * 1024,
                                acceptMimeTypes: fileLibraryConstants.IMAGE_MIME_TYPES,
                                allowChangeImageDimension: false,
                                allowMultiHardDriveFileSelection: false
                            },
                            libraries: vm.fileLibraries,
                            selectedLibrary: vm.selectFileLibrary,
                            selectedFolderName: vm.selectedDirectory && vm.selectedDirectory.name
                        };
                    }
                }
            }).result.then(function (blob) {
                if (!blob) return;
                //TODO: just refresh when changing library or directory
                refreshLibraryFileManagement(blob);
            });

            function refreshLibraryFileManagement(blob) {
                if (vm.selectFileLibrary.libraryId !== blob.library) {
                    setSelectedLibrary(blob);
                } else if (vm.selectedDirectory.name !== blob.directory) {
                    setSelectedDirectory(blob.directory);
                }
                updateClientApi(blob);
                return;

                function setSelectedLibrary(blob) {
                    for (var i = 0; i < vm.fileLibraries.length; i++) {
                        var library = vm.fileLibraries[i];
                        if (library.libraryId === blob.library) {
                            vm.selectFileLibrary = library;
                            onFileLibraryChange();
                            setSelectedDirectory(blob.directory);
                            return;
                        }
                    }
                }

                function setSelectedDirectory(directoryName) {
                    for (var i = 0; i < vm.selectFileLibrary.directories.length; i++) {
                        var directory = vm.selectFileLibrary.directories[i];
                        if (directory.name === directoryName) {
                            vm.selectedDirectory = directory;
                            return;
                        }
                    }
                }

                function updateClientApi(blob) {
                    var existedDirectory = vm.directoryMap[blob.directory];
                    if (existedDirectory) {
                        fileLibraryManagementSvc.insertBlobToDirectory(existedDirectory, blob);
                    } else {
                        var newDirectory = {
                            name: blob.directory,
                            blobs: [blob]
                        };
                        vm.selectFileLibrary.directories.push(newDirectory);
                        vm.directoryMap[newDirectory.name] = newDirectory;
                        vm.selectedDirectory = newDirectory;
                    }

                    var existedBlob = vm.selectedDirectory.blobs.some(function (blobItem) { return blobItem.name === blob.name; });
                    if (!existedBlob) {
                        vm.selectedDirectory.blobs.push(blob);
                    }
                }
            }
        }

        function onCreateDirectory() {
            $modal.open({
                templateUrl: 'survey/fileLibraryManagement/createDirectoryModal/create-directory-modal.html',
                controller: 'createDirectoryModalCtrl',
                windowClass: 'center-modal create-directory-modal',
                resolve: {
                    modalData: function () {
                        return {
                            directoryNames: vm.selectFileLibrary.directories.map(function (directory) {
                                return directory.name;
                            })
                        };
                    }
                }
            }).result.then(function (newDirectory) {
                if (newDirectory) {
                    vm.selectFileLibrary.directories.push(newDirectory);
                    vm.directoryMap[newDirectory.name] = newDirectory;
                }
            });
        }
    }
})();