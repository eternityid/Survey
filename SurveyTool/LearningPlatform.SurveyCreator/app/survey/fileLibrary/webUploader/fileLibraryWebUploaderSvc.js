(function () {
    angular.module('svt')
        .service('fileLibraryWebUploaderSvc', FileLibraryWebUploaderSvc);

    FileLibraryWebUploaderSvc.$inject = ['fileUtilSvc'];

    function FileLibraryWebUploaderSvc(
        fileUtilSvc) {
        var service = {
            validateFile: validateFile
        };
        return service;

        function validateFile(data) {
            if (!fileUtilSvc.isValidFileName(data.fileNameWithoutExtension)) {
                toastr.error('File name is invalid');
                return false;
            }
            if (!fileUtilSvc.isValidFolderName(data.directory)) {
                toastr.error('Folder name is invalid');
                return false;
            }
            return true;
        }
    }
})();