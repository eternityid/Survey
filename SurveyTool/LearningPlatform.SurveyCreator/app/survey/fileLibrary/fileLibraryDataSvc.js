(function () {
    angular
        .module('svt')
        .factory('fileLibraryDataSvc', FileLibraryDataSvc);

    FileLibraryDataSvc.$inject = ['$resource', 'host'];

    function FileLibraryDataSvc($resource, host) {
        var dataService = {
            getFilesLibrary: getFilesLibrary,
            uploadHardDriveFile: uploadHardDriveFile,
            uploadBlobViaSourceUri: uploadBlobViaSourceUri,
            getUserFileLibraries: getUserFileLibraries,
            deleteBlob: deleteBlob,
            updateBlob: updateBlob,
            addDirectory: addDirectory
        };

        return dataService;

        function getFilesLibrary() {
            return $resource(host + '/library/directory-tree', {}, { 'getFilesLibrary': { method: 'GET' } })
                .getFilesLibrary();
        }

        function getUserFileLibraries() {
            return $resource(host + '/library/directory-tree/user', {}, { 'getUserFileLibraries': { method: 'GET' } })
                .getUserFileLibraries();
        }

        function uploadBlobViaSourceUri(data) {
            var formData = new FormData();
            formData.append('sourceUri', data.sourceUri);
            formData.append('fileNameWithoutExtension', data.fileNameWithoutExtension);
            if (data.directory) formData.append('directory', data.directory);
            if (data.description) formData.append('description', data.description);

            return $resource(host + '/library/blobs?fromUri=true', {}, { 'upload': { method: 'POST', transformRequest: angular.identity, headers: { 'Content-Type': undefined } } })
                            .upload({}, formData);
        }

        function uploadHardDriveFile(libraryFile) {
            var uploadForm = new FormData();
            uploadForm.append('file', libraryFile.file);
            uploadForm.append('fileNameWithoutExtension', libraryFile.fileNameWithoutExtension);
            if (libraryFile.directory) uploadForm.append('directory', libraryFile.directory);
            if (libraryFile.description) uploadForm.append('description', libraryFile.description);

            return $resource(host + '/library/blobs',
                {},
                {
                    'uploadHardDriveFile': {
                        method: 'POST',
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    }
                }).uploadHardDriveFile({}, uploadForm);
        }

        function deleteBlob(blob) {
            return $resource(host + '/library/blobs/delete-single-blob',
                {}, { 'deleteBlob': { method: 'POST' } }, { stripTrailingSlashes: false })
                .deleteBlob({}, JSON.stringify({
                    blobName: blob.name
                }));
        }

        function updateBlob(blob, newDirectoryName) {
            return $resource(host + '/library/blobs/update-single-blob',
                {}, { 'updateBlob': { method: 'POST' } })
              .updateBlob({}, JSON.stringify({
                  blobName: blob.name,
                  blobDirectory: newDirectoryName,
                  blobDescription: blob.description
              }));
        }

        function addDirectory(directoryName) {
            return $resource(host + '/library/directories',
             {}, { 'addDirectory': { method: 'POST' } })
             .addDirectory({}, JSON.stringify({
                 name: directoryName
             }));
        }
    }
})();