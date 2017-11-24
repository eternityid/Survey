(function () {
    angular.module('svt').factory('launchDataSvc', launchDataSvc);

    launchDataSvc.$inject = ['$resource', 'host'];

    function launchDataSvc($resource, host) {
        return {
            sendEmail: sendEmail,
            updateSurveyStatus: updateSurveyStatus
        };

        function sendEmail(surveyId, sendMessageForm) {
            return $resource(host + '/surveys/:surveyId/respondents/launch/email', { surveyId: '@surveyId' }, { 'sendEmail': { method: 'POST' } })
                    .sendEmail({ surveyId: surveyId }, JSON.stringify(sendMessageForm));
        }

        function updateSurveyStatus(surveyId, status) {
            var data = {
                surveyId: surveyId,
                status: status
            };
            return $resource(host + '/surveys/:surveyId/surveyinfo/status', { surveyId: surveyId }, { 'UpdateSurveyStatus': { method: 'PUT' } })
                    .UpdateSurveyStatus(JSON.stringify(data));
        }
    }

})();