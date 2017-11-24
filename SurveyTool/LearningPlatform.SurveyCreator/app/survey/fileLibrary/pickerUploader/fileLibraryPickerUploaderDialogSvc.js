(function () {
    angular.module('svt').service('fileLibraryPickerUploaderDialogSvc', FileLibraryPickerUploaderDialogSvc);

    function FileLibraryPickerUploaderDialogSvc() {
        var service = {
            getLibraryIndexByBlobUrl: getLibraryIndexByBlobUrl
        };
        return service;

        function getLibraryIndexByBlobUrl(libraries, url) {
            if (!url) return -1;
            var path = url.split('?')[0];
            for (var i = 0; i < libraries.length; i++) {
                for (var j = 0; j < libraries[i].directories.length; j++) {
                    for (var k = 0; k < libraries[i].directories[j].blobs.length; k++) {
                        if (libraries[i].directories[j].blobs[k].uri === path) {
                            return i;
                        }
                    }
                }
            }
            return -1;
        }
    }
})();