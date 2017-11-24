(function () {
    'use strict';
    angular
        .module('svt')
        .service('pictureOptionListSvc', PictureOptionListSvc);

    PictureOptionListSvc.$inject = [
        'languageStringUtilSvc', 'guidUtilSvc', 'stringUtilSvc'
    ];

    function PictureOptionListSvc(languageStringUtilSvc, guidUtilSvc, stringUtilSvc) {
        var service = {
            buildDefaultOptions: buildDefaultOptions,
            buildNewOptionBasedOnExistedOptions: buildNewOptionBasedOnExistedOptions,
            validateOptions: validateOptions,
            validateOptionAliases: validateOptionAliases,
            validateOptionPictures: validateOptionPictures,
            validateOptionTitles: validateOptionTitles
        };
        return service;

        function buildDefaultOptions(surveyId) {
            return [
                {
                    $type: "Option",
                    text: languageStringUtilSvc.buildLanguageString(surveyId, 'Option 1'),
                    alias: "1",
                    isFixedPosition: false,
                    isExclusive: false,
                    isNotApplicable: false,
                    optionsMask: {
                        $type: "OptionsMask",
                        questionId: null,
                        optionsMaskType: null,
                        customOptionsMask: null
                    },
                    otherQuestionDefinition: null,
                    pictureName: null,
                    picture: {},
                    groupAlias: null,
                    referenceListId: null,
                    guid: 'Option' + guidUtilSvc.createGuid()
                }
            ];
        }

        function buildNewOptionBasedOnExistedOptions(surveyId, existedOptions) {
            var existedAliases = existedOptions.map(function (item) {
                return item.alias;
            });
            var newOptionAlias = getMaxValueOfOptionAliases(existedAliases) + 1;
            var newOptionTitle = 'Option ' + newOptionAlias;

            return {
                $type: "Option",
                text: languageStringUtilSvc.buildLanguageString(surveyId, newOptionTitle),
                alias: String(newOptionAlias),
                isFixedPosition: false,
                isExclusive: false,
                isNotApplicable: false,
                optionsMask: {
                    $type: "OptionsMask",
                    questionId: null,
                    optionsMaskType: null,
                    customOptionsMask: null
                },
                otherQuestionDefinition: null,
                pictureName: null,
                picture: {},
                groupAlias: null,
                referenceListId: null,
                guid: 'Option' + guidUtilSvc.createGuid()
            };

            function getMaxValueOfOptionAliases(aliases) {
                var maxValue = 0;

                for (var i = 0; i < aliases.length; i++) {
                    var integerValueOfAlias = parseInt(aliases[i]);
                    if (!isNaN(integerValueOfAlias) && integerValueOfAlias > maxValue) {
                        maxValue = integerValueOfAlias;
                    }
                }

                return maxValue;
            }
        }

        function validateOptions(options) {
            var optionTitlesValidationResult = service.validateOptionTitles(options);
            if (optionTitlesValidationResult.valid === false) {
                return optionTitlesValidationResult;
            }
            var optionAliasesValidationResult = service.validateOptionAliases(options);
            return optionAliasesValidationResult.valid === false ? optionAliasesValidationResult : service.validateOptionPictures(options);
        }

        function validateOptionAliases(options) {
            var validationResult = {
                valid: true,
                message: '',
                optionGuid: ''
            };

            for (var o = 0; o < options.length; o++){
                if (stringUtilSvc.isEmpty(options[o].alias)) {
                    validationResult.valid = false;
                    validationResult.message = 'Option at position "' + (o + 1) + '" is missing alias.';
                    validationResult.optionGuid = options[o].guid;
                    return validationResult;
                }
            }

            if (options.length === 1) {
                return validationResult;
            }

            for (var i = 0; i < options.length; i++){
                for (var j = 0; j < options.length; j++){
                    if (options[i].guid !== options[j].guid && stringUtilSvc.isEquals(options[i].alias, options[j].alias)) {
                        validationResult.valid = false;
                        validationResult.message = 'Option alias "' + options[i].alias + '" have already existed in question.';
                        validationResult.optionGuid = options[i].guid;
                        return validationResult;
                    }
                }
            }

            return validationResult;
        }

        function validateOptionPictures(options) {
            var validationResult = {
                valid: true,
                message: '',
                optionGuid: ''
            };

            for (var i = 0; i < options.length; i++) {
                if (stringUtilSvc.isEmpty(options[i].pictureName)) {
                    var optionPosition = i + 1;
                    validationResult.valid = false;
                    validationResult.message = 'Option at position "' + optionPosition + '" is missing picture.';
                    validationResult.optionGuid = options[i].guid;
                    return validationResult;
                }
            }

            return validationResult;
        }

        function validateOptionTitles(options) {
            var validationResult = {
                valid: true,
                message: '',
                optionGuid: ''
            };

            for (var o = 0; o < options.length; o++){
                if (stringUtilSvc.isEmpty(options[o].text.items[0].text)) {
                    validationResult.valid = false;
                    validationResult.message = 'Option at position "' + (o + 1) + '" is missing title.';
                    validationResult.optionGuid = options[o].guid;
                    return validationResult;
                }
            }

            for (var i = 0; i < options.length; i++) {
                for (var j = 0; j < options.length; j++) {
                    if (options[i].guid !== options[j].guid && stringUtilSvc.isEquals(options[i].text.items[0].text, options[j].text.items[0].text)) {
                        validationResult.valid = true;
                        validationResult.message = 'Option title "' + stringUtilSvc.getPlainText(options[i].text.items[0].text) + '" have already existed in question.';
                        return validationResult;
                    }
                }
            }

            return validationResult;
        }
    }
})();