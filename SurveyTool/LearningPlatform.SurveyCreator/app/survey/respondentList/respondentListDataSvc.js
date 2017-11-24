(function () {
    'use strict';

    angular
        .module('svt')
        .factory('respondentListDataSvc', respondentListDataSvc);

    respondentListDataSvc.$inject = ['$resource', 'host'];

    function respondentListDataSvc($resource, host) {
        var dataService = {
            sendEmail: sendEmail,
            sendEmailFromLaunch: sendEmailFromLaunch,
            testSendEmail: testSendEmail,
            search: search,
            importContacts: importContacts,
            addRespondents: addRespondents,
            deleteRespondents: deleteRespondents,
            getSurveyLatestVerion: getSurveyLatestVerion
        };

        return dataService;

        function sendEmail(surveyId, sendRespondentForm, testMode) {
            return $resource(host + '/surveys/:surveyId/respondents/send', { surveyId: '@surveyId', testMode: testMode }, { 'sendEmail': { method: 'POST' } })
                        .sendEmail({ surveyId: surveyId }, JSON.stringify(sendRespondentForm));
        }

        function sendEmailFromLaunch(surveyId, sendMessageForm) {
            return $resource(host + '/surveys/:surveyId/respondents/sendfromlaunch', { surveyId: '@surveyId' }, { 'sendEmailFromLaunch': { method: 'POST' } })
                        .sendEmailFromLaunch({ surveyId: surveyId }, JSON.stringify(sendMessageForm));
        }

        function testSendEmail(surveyId, sendRespondentForm) {
            return $resource(host + '/surveys/:surveyId/respondents/testsend', { surveyId: '@surveyId' }, { 'testSendEmail': { method: 'POST' } })
                        .testSendEmail({ surveyId: surveyId }, JSON.stringify(sendRespondentForm));
        }

        function search(surveyId, searchRespondentModel, testMode) {
            return $resource(host + '/surveys/:surveyId/respondents/search', { surveyId: '@surveyId', testMode: testMode }, { 'search': { method: 'POST' } })
                       .search({ surveyId: surveyId }, JSON.stringify(searchRespondentModel));
        }

        function importContacts(surveyId, respondentFileName, testMode) {
            var uploadForm = new FormData();
            uploadForm.append('respondentFileName', respondentFileName);
            return $resource(host + '/surveys/:surveyId/respondents/importcontacts', { surveyId: '@surveyId', testMode: testMode }, { 'upload': { method: 'POST', transformRequest: angular.identity, headers: { 'Content-Type': undefined } } })
                        .upload({ surveyId: surveyId }, uploadForm);
        }

        function addRespondents(surveyId, respondentEmails, testMode) {
            return $resource(host + '/surveys/:surveyId/respondents', { surveyId: '@surveyId', testMode: testMode }, { 'add': { method: 'POST' } })
                       .add({ surveyId: surveyId }, JSON.stringify(respondentEmails));
        }

        function deleteRespondents(surveyId, respondentIds, testMode) {
            return $resource(host + '/surveys/:surveyId/respondents/delete', { surveyId: '@surveyId', testMode: testMode }, { 'delete': { method: 'POST' } })
                        .delete({ surveyId: surveyId }, JSON.stringify(respondentIds));
        }

        function getSurveyLatestVerion(surveyId) {
            return $resource(host + '/surveys/:surveyId/latest-published-version', { surveyId: '@surveyId' }, { 'getSurveyLatestVerion': { method: 'GET' } })
                        .getSurveyLatestVerion({ surveyId: surveyId });
        }
    }
})();