(function () {
    angular.module('svt').factory('surveySvc', surveySvc);
    function surveySvc() {
        var surveyStatus = {
            NEW: 0,
            OPEN: 1,
            TEMPORARILY_CLOSED: 2,
            CLOSED: 3
        };

        var service = {
            getStatusDisplay: getStatusDisplay,
            isClosed: isClosed,
            isTemporarilyClosed: isTemporarilyClosed,
            isOpen: isOpen,
            surveyStatus: surveyStatus
        };
        return service;

        function getStatusDisplay(status) {
            switch (parseInt(status)) {
                case surveyStatus.NEW:
                    return 'New';
                case surveyStatus.OPEN:
                    return 'Open';
                case surveyStatus.CLOSED:
                    return 'Closed';
                case surveyStatus.TEMPORARILY_CLOSED:
                    return 'Temporarily closed';
                default:
                    return '';
            }
        }

        function isClosed(status) {
            return status === surveyStatus.CLOSED;
        }

        function isTemporarilyClosed(status) {
            return parseInt(status) === surveyStatus.TEMPORARILY_CLOSED;
        }

        function isOpen(status) {
            return parseInt(status) === surveyStatus.OPEN;
        }
    }
})();