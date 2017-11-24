(function() {
    angular.module('svt')
        .factory('createNewSurveySvc', createNewSurveySvc);

    function createNewSurveySvc() {
        var service = {
            validateNewSurvey: validateNewSurvey
        };
        return service;

        function validateNewSurvey(data) {
            var validationResult = {
                valid: true,
                message: ''
            };
            if (data.hasOwnProperty('existingSurveyId') && !data.existingSurveyId) {
                validationResult.valid = false;
                validationResult.message = 'Existing survey is required';
                return validationResult;
            }
            if (data.hasOwnProperty('librarySurveyId') && !data.librarySurveyId) {
                validationResult.valid = false;
                validationResult.message = 'Survey from library is required';
                return validationResult;
            }
            if (!data.surveyTitle || !data.surveyTitle.trim()) {
                validationResult.valid = false;
                validationResult.message = 'Survey title is required';
                return validationResult;
            }
            return validationResult;
        }
    }
})();