(function () {
    'use strict';
    angular
        .module('svt').filter('trustAsHtmlFilter', TrustAsHtmlFilter);

    TrustAsHtmlFilter.$inject = ['$sce'];

    function TrustAsHtmlFilter($sce) {
        return $sce.trustAsHtml;
    }

})();