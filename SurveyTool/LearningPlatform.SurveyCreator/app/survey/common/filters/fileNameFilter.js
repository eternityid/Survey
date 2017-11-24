(function () {
    angular.module('svt')
        .filter('fileNameFilter', FileNameFilter);

    FileNameFilter.$inject = ['stringUtilSvc', 'fileUtilSvc'];

    function FileNameFilter(
        stringUtilSvc, fileUtilSvc) {
        return function (filePath, length, append) {
            if (!filePath) return '';
            if (isNaN(length)) length = 20;
            if (!angular.isString(append)) append = '';

            var fileName = fileUtilSvc.getFileNameFromPath(filePath.replace(/\\/g, '/'), '/');
            var guidLength = 32;
            fileName = fileUtilSvc.removePrefixGuidInFileName(fileName, guidLength);

            return stringUtilSvc.truncateByCharAmount(fileName, length - append.length, append);
        };
    }
})();