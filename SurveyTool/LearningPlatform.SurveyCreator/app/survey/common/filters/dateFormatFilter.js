(function() {
    'use strict';
    angular.module("svt").filter('dateFormatFilter', ['$filter', 'dateFormatConfig', DateFormatFilter]);

    function DateFormatFilter($filter, dateFormatConfig) {
        return function (data, sourceDateFormat) {
            if (typeof data === 'undefined') {
                return data;
            }

            var dateFormat = sourceDateFormat ? sourceDateFormat : dateFormatConfig.date;
            return $filter('date')(data, dateFormat);
        };
    }
})();