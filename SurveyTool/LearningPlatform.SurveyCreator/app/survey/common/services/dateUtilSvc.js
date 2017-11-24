(function() {
    angular.module('svt').service('dateUtilSvc', DateUtilSvc);

    function DateUtilSvc() {
        var service = {
            isDateString: isDateString,
            compareDateTime: compareDateTime
        };
        return service;

        function isDateString(value, format) {
            return moment(value, format, true).isValid();
        }

        function compareDateTime(firstDate, secondDate, format) {
            var fromDate = moment(firstDate);
            var toDate = moment(secondDate);
            if (fromDate > toDate) return 1;
            else if (fromDate < toDate) return -1;
            else return 0;
        }
    }
})();