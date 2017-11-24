(function () {
    angular
        .module('svt')
        .service('fileBaseValidation', FileBaseValidation);

    FileBaseValidation.$inject = [
        'fileLibraryConstants'
    ];

    function FileBaseValidation(
        fileLibraryConstants) {
        var service = {
            validate: validate
        };
        return service;

        function validate(blob, config) {
            var defaultConfig = {
                maxFileSize: fileLibraryConstants.MAX_FILE_SIZE,
                acceptMimeTypes: fileLibraryConstants.ACCEPT_MIME_TYPES
            };
            config = angular.extend(defaultConfig, config);

            if (!blob) {
                return fileLibraryConstants.INVALID_FILE.IS_NOT_EXISTS;
            }

            var isInValidFileMimeType = config.acceptMimeTypes.every(function (mimeType) { return mimeType !== blob.type; });
            if (isInValidFileMimeType) {
                return fileLibraryConstants.INVALID_FILE.ACCEPT_MIME_TYPES;
            }

            if (blob.size > config.maxFileSize) {
                return fileLibraryConstants.INVALID_FILE.MAX_FILE_SIZE;
            }

            return null;
        }

    }
})();