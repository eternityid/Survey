(function () {
    angular.module('svt').filter('byteToKbFilter', ByteToKbFilter);

    ByteToKbFilter.$inject = ['numberUtilSvc'];

    function ByteToKbFilter(numberUtilSvc) {
        return function (byteValue) {
            if (!numberUtilSvc.isInteger(byteValue)) return NaN;
            var intValue = parseInt(byteValue);
            return Math.round(intValue / 1024);
        };
    }
})();