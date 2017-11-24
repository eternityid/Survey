(function () {
    angular.module('svt').filter('byteToMbKbFilter', ByteToMbKbFilter);

    ByteToMbKbFilter.$inject = ['numberUtilSvc'];

    function ByteToMbKbFilter(numberUtilSvc) {
        return function (byteValue) {
            if (!numberUtilSvc.isInteger(byteValue)) return NaN;
            var intValue = parseInt(byteValue);
            var jumpStep = 1024;
            var byteToMb = intValue / jumpStep / jumpStep;

            return byteToMb >= 1 && byteToMb % 1 === 0 ?
                String(byteToMb) + ' MB' :
                String(Math.round(intValue / 1024)) + ' KB';
        };
    }
})();