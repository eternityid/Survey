(function () {
    angular
        .module('svt')
        .service('fileLibraryHardDiskUploaderSvc', fileLibraryHardDiskUploaderSvc);

    fileLibraryHardDiskUploaderSvc.$inject = [
        'fileUtilSvc', 'fileLibraryConstants', 'fileBaseValidation'
    ];

    function fileLibraryHardDiskUploaderSvc(
        fileUtilSvc, fileLibraryConstants, fileBaseValidation) {
        var service = {
            validate: validate
        };
        return service;

        function validate(model, config) {
            var fileValidation = fileBaseValidation.validate(model.file, config);
            if (fileValidation) {
                return fileValidation;
            }

            if (!fileUtilSvc.isValidFileName(model.fileNameWithoutExtension)) {
                return fileLibraryConstants.INVALID_HARD_DRIVE_FILE.FILE_NAME_WITHOUT_EXT;
            }

            if (!fileUtilSvc.isValidFolderName(model.directory)) {
                return fileLibraryConstants.INVALID_HARD_DRIVE_FILE.FOLDER_NAME;
            }

            return null;
        }
    }
})();