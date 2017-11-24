(function() {
    angular.module('svt').factory('surveyTitleAndStatusSvc', surveyTitleAndStatusSvc);
    function surveyTitleAndStatusSvc() {
        var settings = { latestChangedTimestamp: new Date() };

        var service = {
            getSettings: getSettings,
            updateLatestChangedTimestamp: updateLatestChangedTimestamp
        };
        return service;

        function getSettings() {
            return settings;
        }

        function updateLatestChangedTimestamp() {
            settings.latestChangedTimestamp = new Date();
        }
    }
})();