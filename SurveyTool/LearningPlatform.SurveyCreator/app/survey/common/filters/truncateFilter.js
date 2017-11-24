(function () {
    angular.module('svt').filter('truncateFilter', TruncateFilter);
    TruncateFilter.$inject = ['stringUtilSvc'];

    function TruncateFilter(stringUtilSvc) {
        return function (inputText, length, end) {
            if (isNaN(length)) length = 10;
            if(!angular.isString(end)) end = '';

            return stringUtilSvc.truncateByCharAmount(inputText, length, end);
        };
    }
})();