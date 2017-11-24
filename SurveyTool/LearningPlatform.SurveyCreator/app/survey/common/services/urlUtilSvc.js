(function () {
    angular.module('svt').service('urlUtilSvc', UrlUtilSvc);

    function UrlUtilSvc() {
        var service = {
            getParameterValue: getParameterValue
        };
        return service;

        function getParameterValue(url, param) {
            if (!url) return null;

            param = param.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + param + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
    }
})();