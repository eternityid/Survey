(function () {
    angular
        .module('svt')
        .service('languageStringUtilSvc', languageStringUtilSvc);

    languageStringUtilSvc.$inject = [];

    function languageStringUtilSvc() {
        var service = {
            buildLanguageString: buildLanguageString
        };

        return service;

        function buildLanguageString(surveyId, message) {
            return {
                $type: 'LanguageString',
                surveyId: surveyId || 0,
                items: [{
                    $type: 'LanguageStringItem',
                    language: "en",
                    text: message || ''
                }]
            };
        }
    }
})();