(function () {
    'use strict';

    angular
        .module('svt')
        .factory('respondentDetailDialogDataSvc', respondentDetailDialogDataSvc);

    respondentDetailDialogDataSvc.$inject = ['$resource', 'host'];

    function respondentDetailDialogDataSvc($resource, host) {
        return {
            getRespondentDetail: getRespondentDetail
        };

        function getRespondentDetail(surveyId, respondentId, testMode) {
            return $resource(host + '/surveys/:surveyId/respondents/:respondentId/detail', { surveyId: '@surveyId', respondentId: '@respondentId', testMode: testMode }, {
                'getRespondentDetail': {
                    method: 'GET'
                }
            })
            .getRespondentDetail({ surveyId: surveyId, respondentId: respondentId });
        }
    }

})();