(function () {
    angular.module('svt').service('libraryImagePreviewerSvc', LibraryImagePreviewerSvc);

    LibraryImagePreviewerSvc.$inject = [
        'urlUtilSvc', 'numberUtilSvc'];

    function LibraryImagePreviewerSvc(
        urlUtilSvc, numberUtilSvc) {
        var service = {
            parseImageUrlWithParameters: parseImageUrlWithParameters
        };
        return service;

        function parseImageUrlWithParameters(imageUrl, imageSize, allowChangeImageDimension) {
            var url = imageUrl.split('?')[0];
            if (allowChangeImageDimension) {
                var parameters = [];
                if (imageSize.width !== undefined) {
                    parameters.push('width=' + imageSize.width + 'px');
                }
                if (imageSize.height !== undefined) {
                    parameters.push('height=' + imageSize.height + 'px');
                }
                var appendQueryString = parameters.join('&');
                url = appendQueryString !== '' ?
                    url + '?' + appendQueryString :
                    url;
            }
            return url;
        }
    }
})();