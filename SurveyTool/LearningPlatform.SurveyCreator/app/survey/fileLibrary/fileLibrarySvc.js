(function () {
    angular
        .module('svt')
        .factory('fileLibrarySvc', FileLibrarySvc);

    FileLibrarySvc.$inject = ['stringUtilSvc'];

    function FileLibrarySvc(stringUtilSvc) {
        var service = {
            getImageWidth: getImageWidth,
            getImageHeight: getImageHeight,
            getQueryStringImageUrl: getQueryStringImageUrl,
            getImageUrlWithoutQuerystring: getImageUrlWithoutQuerystring,
            parseToImageStyle: parseToImageStyle
        };

        return service;

        function getImageWidth(imageUrl) {
            var queryStringImageUrl = getQueryStringImageUrl(imageUrl);
            var items = queryStringImageUrl.split('&');

            return items && items[0] ? stringUtilSvc.getNumberInString(items[0]) : null;
        }

        function getImageHeight(imageUrl) {
            var queryStringImageUrl = getQueryStringImageUrl(imageUrl);
            var items = queryStringImageUrl.split('&');

            return items && items[1] ? stringUtilSvc.getNumberInString(items[1]) : null;
        }

        function getQueryStringImageUrl(imageUrl) {
            if (imageUrl.indexOf('?') < 0) return '';
            var startPositionQueryString = imageUrl.indexOf('?');

            return imageUrl.substr(startPositionQueryString + 1, imageUrl.length - startPositionQueryString);
        }

        function getImageUrlWithoutQuerystring(imageUrl) {
            if (imageUrl.indexOf('?') < 0) return imageUrl;

            return imageUrl.substr(0, imageUrl.indexOf('?'));
        }

        function parseToImageStyle(imageUrl) {
            var imageQueryString = getQueryStringImageUrl(imageUrl);
            if (!imageQueryString) return '';

            return imageQueryString.replace(/=/g, ':').replace(/&/g, ';');
        }
    }
})();