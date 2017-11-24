(function () {
    angular
        .module('svt')
        .service('ratingQuestionSvc', ratingQuestionSvc);

    ratingQuestionSvc.$inject = [
        'languageStringUtilSvc', 'questionConst', 'guidUtilSvc', 'questionWithOptionsSvc'
    ];

    function ratingQuestionSvc(languageStringUtilSvc, questionConst, guidUtilSvc, questionWithOptionsSvc) {
        var service = {
            getSteps: getSteps,
            buildOptions: buildOptions,
            buildOptionsBasedOnExistedOptions: buildOptionsBasedOnExistedOptions,
            buildDefaultSubQuestionDefinition: buildDefaultSubQuestionDefinition
        };

        return service;

        function getSteps() {
            var steps = [];

            for (var index = 1; index <= 10; index++) {
                steps.push({
                    displayName: index,
                    value: index
                });
            }

            return steps;
        }

        function buildOptions(surveyId, numberOfSteps) {
            var options = [];

            for (var index = 1; index <= numberOfSteps; index++) {
                options.push({
                    $type: 'Option',
                    alias: String(index),
                    text: languageStringUtilSvc.buildLanguageString(surveyId, String(index))
                });
            }

            return options;
        }

        function buildOptionsBasedOnExistedOptions(surveyId, numberOfSteps, existedOptions) {
            var options = [];
            var numberOfExistedOptions = existedOptions.length;

            if (numberOfExistedOptions - numberOfSteps === 0) {
                return existedOptions;
            } else if (numberOfExistedOptions - numberOfSteps > 0) {
                return existedOptions.slice(0, numberOfSteps);
            } else {
                Array.prototype.push.apply(options, existedOptions);
                for (var index = numberOfExistedOptions + 1; index <= numberOfSteps; index++){
                    options.push({
                        $type: 'Option',
                        alias: String(index),
                        text: languageStringUtilSvc.buildLanguageString(surveyId, String(index))
                    });
                }
                return options;
            }
        }

        function buildDefaultSubQuestionDefinition(question) {
            var defaultSteps = 5;
            var defaultShapeName = 'glyphicon glyphicon-star';
            return {
                $type: questionConst.questionTypes.rating,
                alias: guidUtilSvc.createGuid(),
                shapeName: defaultShapeName,
                optionList: {
                    $type: 'OptionList',
                    surveyId: question.surveyId,
                    options: buildOptions(question.surveyId, defaultSteps),
                    optionGroups: []
                },
                displayOrientation: questionWithOptionsSvc.getOptionDisplayOrientationValues().horizontal,
                optionsMask: questionWithOptionsSvc.getDefaultOptionsMask(),
                pageDefinitionId: null,//TODO remove it
                surveyId: question.surveyId,
                title: languageStringUtilSvc.buildLanguageString(question.surveyId),
                guid: guidUtilSvc.createGuid()
            };
        }
    }
})();