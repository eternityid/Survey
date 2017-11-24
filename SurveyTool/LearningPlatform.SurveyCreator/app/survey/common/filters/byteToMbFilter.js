(function () {
    angular.module('svt').filter('byteToMbFilter', ByteToMbFilter);

    ByteToMbFilter.$inject = ['numberUtilSvc'];

    function ByteToMbFilter(numberUtilSvc) {
        return function (byteValue) {
            if (!numberUtilSvc.isInteger(byteValue)) return NaN;
            var intValue = parseInt(byteValue);
            return Math.round(intValue / 1024 / 1024);
        };
    }
})();