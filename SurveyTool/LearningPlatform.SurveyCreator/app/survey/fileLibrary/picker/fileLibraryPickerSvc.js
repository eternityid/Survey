(function () {
    angular.module('svt').service('fileLibraryPickerSvc', FileLibraryPickerSvc);

    FileLibraryPickerSvc.$inject = [
        'urlUtilSvc', 'numberUtilSvc'];

    function FileLibraryPickerSvc(
        urlUtilSvc, numberUtilSvc) {
        var service = {
            getBlobByUri: getBlobByUri,
            syncImageSize: syncImageSize
        };
        return service;

        function getBlobByUri(directories, uri) {
            var path = uri.split('?')[0];
            var blobs = [];
            directories.forEach(function (directory) {
                blobs.push.apply(blobs, directory.blobs);
            });
            return blobs.find(function (blob) {
                return blob.uri === path;
            });
        }

        function syncImageSize(imageSize, imageUrl) {
            imageSize.width = getDimensionValue(imageUrl, 'width');
            imageSize.height = getDimensionValue(imageUrl, 'height');
        }

        function getDimensionValue(imageUrl, type) {
            var dimension = urlUtilSvc.getParameterValue(imageUrl, type);
            if (!/\d+px$/i.test(dimension)) return undefined;
            var value = dimension.replace(/px/gi, '');
            return numberUtilSvc.isInteger(value) ? parseInt(value) : undefined;
        }
    }
})();