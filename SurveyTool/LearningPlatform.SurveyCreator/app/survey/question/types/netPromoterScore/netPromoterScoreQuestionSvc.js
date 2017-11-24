(function() {
    angular
        .module('svt')
        .service('netPromoterScoreQuestionSvc', netPromoterScoreQuestionSvc);

    netPromoterScoreQuestionSvc.$inject = [
        'languageStringUtilSvc'
    ];


    function netPromoterScoreQuestionSvc(languageStringUtilSvc) {
        var service = {
            buildDefaultOptions: buildDefaultOptions
        };

        return service;

        function buildDefaultOptions(surveyId) {
            var optionList = [];

            for (var score = 0; score <= 10; score++) {
                optionList.push({
                    $type: 'Option',
                    alias: score,
                    text: languageStringUtilSvc.buildLanguageString(surveyId, String(score))
                });
            }

            return optionList;
        }
    }
})();