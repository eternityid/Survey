(function () {
    angular
        .module('svt')
        .factory('fileLibraryManagementSvc', fileLibraryManagementSvc);

    function fileLibraryManagementSvc() {
        var service = {
            insertBlobToDirectory: insertBlobToDirectory
        };

        return service;

        function insertBlobToDirectory(directory, blob) {
            for (var i = 0; i < directory.blobs.length; i++) {
                var blobItem = directory.blobs[i];
                if (blobItem.uri === blob.uri) {
                    angular.copy(blob, blobItem);
                    return;
                }
            }

            directory.blobs.push(blob);
        }
    }
})();