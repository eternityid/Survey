(function() {
    angular
        .module('svt')
        .service('scaleQuestionSvc', scaleQuestionSvc);

    scaleQuestionSvc.$inject = [
        'questionSvc',
        'stringUtilSvc',
        'numberUtilSvc',
        'arrayUtilSvc',
        'languageStringUtilSvc',
        'questionWithOptionsSvc',
        'questionConst',
        'guidUtilSvc'
    ];

    //TODO: Should make a const of toastr

    function scaleQuestionSvc(questionSvc, stringUtilSvc, numberUtilSvc, arrayUtilSvc,
        languageStringUtilSvc, questionWithOptionsSvc, questionConst, guidUtilSvc) {
        var service = {
            validate: validate,
            validateScore: validateScore,
            buildOptions: buildOptions,
            buildOptionsBasedOnExistedOptions: buildOptionsBasedOnExistedOptions,
            getScoreByOptionList: getScoreByOptionList,
            buildDefaultSubQuestionDefinition: buildDefaultSubQuestionDefinition
        };

        return service;

        function validate(min, max) {
            var minScoreValidationResult = validateScore(min, 'Start');
            if (minScoreValidationResult.valid === false) {
                return minScoreValidationResult;
            }

            var maxScoreValidationResult = validateScore(max, 'End');
            if (maxScoreValidationResult.valid === false) {
                return maxScoreValidationResult;
            }

            var validationResult = {
                valid: true,
                message: ''
            };

            if (!angular.isNumber(min) || !angular.isNumber(max)) {
                validationResult.valid = false;
                validationResult.message = 'Start/End must be a valid number.';
                return validationResult;
            }

            if (parseInt(min) >= parseInt(max)) {
                validationResult.valid = false;
                validationResult.message = 'Start must be less than End.';
                return validationResult;
            }

            var MAX_LENGTH = 11;
            if (parseInt(max) - parseInt(min) >= MAX_LENGTH) {
                validationResult.valid = false;
                validationResult.message = 'Start/End is invalid. Maximum length no more than ' + MAX_LENGTH + '.';
                return validationResult;
            }

            return validationResult;
        }

        function validateScore(score, title) {
            var validationResult = {
                valid: true,
                message: ''
            };

            if (score !== 0 && !score) {
                validationResult.valid = false;
                validationResult.message = title + ' is required.';
                return validationResult;
            }
            if (!stringUtilSvc.isEmpty(score) && !numberUtilSvc.isInteger(score)) {
                validationResult.valid = false;
                validationResult.message = title + ' is invalid.';
                return validationResult;
            }

            return validationResult;
        }

        function buildOptions(min, max) {
            var likertScoreMin = parseInt(min);
            var likertScoreMax = parseInt(max);
            var optionList = [];

            var surveyId = questionSvc.getSelectedSurveyId();
            for (var score = likertScoreMin; score <= likertScoreMax; score++) {
                optionList.push({
                    $type: 'Option',
                    alias: String(score),
                    text: languageStringUtilSvc.buildLanguageString(surveyId, String(score))
                });
            }

            return optionList;
        }

        function buildOptionsBasedOnExistedOptions(min, max, existedOptions) {
            var tempOptions = buildOptions(min, max);
            var options = angular.copy(tempOptions);

            for (var i = 0; i < existedOptions.length; i++){
                for (var j = 0; j < tempOptions.length; j++) {
                    if (existedOptions[i].alias === tempOptions[j].alias) {
                        options[j] = existedOptions[i];
                    }
                }
            }

            return options;
        }

        function getScoreByOptionList(optionList) {
            var score = {
                min: 1,
                max: 5
            };

            if (optionList && arrayUtilSvc.isArrayHasElement(optionList.options)) {
                var numberOfOptions = optionList.options.length;
                score.min = Number(optionList.options[0].text.items[0].text);
                score.max = numberOfOptions + score.min - 1;
            }

            return score;
        }

        function buildDefaultSubQuestionDefinition(parentQuestion) {
            var defaultScore = {
                min: 1,
                max: 5
            };

            return {
                $type: questionConst.questionTypes.scale,
                alias: guidUtilSvc.createGuid(),
                optionList: {
                    $type: 'OptionList',
                    surveyId: parentQuestion.surveyId,
                    options: buildOptions(defaultScore.min, defaultScore.max),
                    optionGroups: []
                },
                renderOptionByButton: true,
                likertLeftText: languageStringUtilSvc.buildLanguageString(parentQuestion.surveyId),
                likertCenterText: languageStringUtilSvc.buildLanguageString(parentQuestion.surveyId),
                likertRightText: languageStringUtilSvc.buildLanguageString(parentQuestion.surveyId),
                displayOrientation: questionWithOptionsSvc.getOptionDisplayOrientationValues().horizontal,
                optionsMask: questionWithOptionsSvc.getDefaultOptionsMask(),
                pageDefinitionId: null, //TODO remove it
                surveyId: parentQuestion.surveyId,
                title: languageStringUtilSvc.buildLanguageString(parentQuestion.surveyId),
                guid: guidUtilSvc.createGuid()
            };
        }
    }
})();