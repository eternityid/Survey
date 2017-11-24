(function () {
    angular.module('svt').service('fileUtilSvc', fileUtilSvc);

    function fileUtilSvc() {
        var service = {
            getFileNameByTimestamp: getFileNameByTimestamp,
            isValidFileName: isValidFileName,
            isValidFolderName: isValidFolderName,
            getFileNameFromPath: getFileNameFromPath,
            getFileNameWithoutExtensionFromPath: getFileNameWithoutExtensionFromPath,
            removePrefixGuidInFileName: removePrefixGuidInFileName
        };
        return service;

        function getFileNameByTimestamp(fileName) {
            var fileExtension = fileName.replace(/^.*\./, '');
            var extractedName = fileName.substr(0, fileName.length - fileExtension.length - 1);
            return String(getTimestamp()) + '_' + extractedName + '.' + fileExtension;

            function getTimestamp() {
                if (!Date.now) {
                    Date.now = function () { return new Date().getTime(); };
                }
                return Date.now();
            }
        }

        function isValidFileName(value) {
            if (typeof value !== 'string') return false;
            value = value.trim();
            if (value.length < 1) return false;
            return !/[\\/:*?"<>|]/g.test(value);
        }

        function isValidFolderName(value) {
            if (typeof value !== 'string') return false;
            value = value.trim();
            if (value.length < 1) return false;
            if (value.charAt(0) === '.') return false;
            return !/[\\/:*?"<>|]/g.test(value);
        }

        function getFileNameFromPath(path, separator) {
            if (!path) return '';
            var parts = path.split(separator);
            return parts[parts.length - 1].split('?')[0];
        }

        function getFileNameWithoutExtensionFromPath(path, separator) {
            var fileName = getFileNameFromPath(path, separator);
            var names = fileName.split('.');
            names.pop();
            return names.join('.').trim();
        }

        function removePrefixGuidInFileName(fileName, guidLength) {
            //Example: 0d81aa37b61149c79fbe0ceebfeaedc7_01.png, 19332852453443e0a0acafdb78b5647d_logo.png
            if (!fileName || fileName.length < guidLength) return fileName;
            var guid = fileName.substring(0, guidLength);
            return guid.replace(/[A-Za-z0-9]/g, '') !== '' ?
                fileName :
                fileName.substring(guidLength + 1, fileName.length);
        }
    }
})();