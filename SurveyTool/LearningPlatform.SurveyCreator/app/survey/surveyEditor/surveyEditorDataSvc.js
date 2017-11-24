(function() {
    'use strict';

    angular
        .module('svt')
        .factory('surveyEditorDataSvc', surveyEditorDataSvc);

    surveyEditorDataSvc.$inject = ['$resource', 'host'];

    function surveyEditorDataSvc($resource, host) {
        var dataService = {
            getSurvey: getSurvey,
            getUser: getUser
        };
        return dataService;

        function getSurvey(surveyId, surveyVersion) {
            var params = {
                method: 'GET'
            };

            if (surveyVersion !== undefined) {
                params.headers = {
                    'If-None-Match': surveyVersion
                };
            }

            return $resource(host + '/surveys/:surveyId/', { surveyId: '@surveyId' }, { 'getSurvey': params }).getSurvey({ surveyId: surveyId });
        }

        function getUser() {
            var params = { method: 'GET' };

            return $resource(host + '/user', {}, { 'getUser': params })
                .getUser({});
        }
    }
})();