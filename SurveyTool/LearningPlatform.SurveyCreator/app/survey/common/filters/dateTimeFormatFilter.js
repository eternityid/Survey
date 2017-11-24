(function() {
    'use strict';
    angular.module("svt").filter('dateTimeFormatFilter', ['$filter', 'dateFormatConfig', DateTimeFormatFilter]);

    function DateTimeFormatFilter($filter, dateFormatConfig) {
        return function (data, sourceDateFormat) {
            if (!data) return 'N/A';
            var dateTimeFormat = sourceDateFormat ? sourceDateFormat : dateFormatConfig.dateTime;
            return $filter('date')(data, dateTimeFormat);
        };
    }
})();