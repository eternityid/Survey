(function () {
    'use strict';

    angular
       .module('svt').filter('htmlToPlainTextFilter', HtmlToPlainTextFilter);

    HtmlToPlainTextFilter.$inject = ['stringUtilSvc'];

    function HtmlToPlainTextFilter(stringUtilSvc) {
        return function(input) {
            return stringUtilSvc.getPlainText(input);
        };
    }
})();