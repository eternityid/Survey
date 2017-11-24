(function () {
    angular.module('svt').factory('reportListSvc', reportListSvc);
    reportListSvc.$inject = ['$timeout'];

    function reportListSvc($timeout) {
        var service = {
            getDefaultPaging: getDefaultPaging,
            getDefaultReports: getDefaultReports,
            populateReports: populateReports
        };
        return service;

        function getDefaultPaging() {
            return {
                $type: "Paging",
                start: 0,
                limit: 10,
                hashNext: false
            };
        }

        function getDefaultReports() {
            return { data: [] };
        }

        function populateReports(reportResults, reports) {
            if (!reportResults) return reports;
            for (var index = 0; index < reportResults.length; index++) {
                reports.data.push({
                    reportId: reportResults[index].id,
                    name: reportResults[index].name,
                    surveyId: reportResults[index].surveyId,
                    createdDate: reportResults[index].createdDate,
                    modifiedDate: reportResults[index].modifiedDate
                });
            }
            return reports;
        }

    }
})();