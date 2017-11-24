(function() {
    angular.module('svt')
        .factory('surveySettingsSvc', SurveySettingsSvc);

    function SurveySettingsSvc() {
        var service = {
            getPlaceHolders: getPlaceHolders,
            validateSurveySettings: validateSurveySettings
        };
        return service;

        function getPlaceHolders() {
            return {
                surveyName: {
                    value: 'Untitled',
                    valid: true
                }
            };
        }

        function validateSurveySettings(settings, placeHolder) {
            if (!settings.surveyTitle || !settings.surveyTitle.trim()) {
                placeHolder.surveyName.value = 'Survey title is required';
                placeHolder.surveyName.valid = false;
                return false;
            }
            placeHolder.surveyName.valid = true;
            return true;
        }
    }
})();