(function () {
    'use strict';
    angular
        .module('svt')
        .service('textListQuestionSvc', TextListQuestionSvc);

    TextListQuestionSvc.$inject = [
        'guidUtilSvc', 'languageStringUtilSvc', 'questionConst', 'selectionOptionListSvc',
        'serverValidationSvc', 'textQuestionSvc'
    ];

    function TextListQuestionSvc(guidUtilSvc, languageStringUtilSvc, questionConst, selectionOptionListSvc,
        serverValidationSvc, textQuestionSvc) {
        var validationTypes = serverValidationSvc.getServerValidationTypes();
        var service = {
            buildDefaultSubQuestionDefinition: buildDefaultSubQuestionDefinition,
            validate: validate
        };

        return service;
        
        function buildDefaultSubQuestionDefinition(question, isLongTextList) {
            var defaultQuestion = {
                $type: null,
                alias: guidUtilSvc.createGuid(),
                pageDefinitionId: null,//TODO remove it
                surveyId: question.surveyId,
                title: languageStringUtilSvc.buildLanguageString(question.surveyId),
                guid: guidUtilSvc.createGuid()
            };

            if (isLongTextList) {
                defaultQuestion.$type = questionConst.questionTypes.longText;
                var defaultRows = 2;
                defaultQuestion.rows = defaultRows;
            } else {
                defaultQuestion.$type = questionConst.questionTypes.shortText;
            }

            return defaultQuestion;
        }

        function validate(question) {
            var selectionValidationResult = selectionOptionListSvc.validateOptions(
                question.id, question.optionList.options, question.optionList.optionGroups);
            if (selectionValidationResult.valid === false) {
                return selectionValidationResult;
            }

            var lengthValidation = question.validations.filter(function (validation) {
                return validation.$type === validationTypes.length;
            })[0];
            var charactersValidationResult = textQuestionSvc.validateCharacters(lengthValidation.min, lengthValidation.max);
            if (charactersValidationResult.valid === false) {
                return charactersValidationResult;
            }

            var wordsAmountValidation = question.validations.filter(function (validation) {
                return validation.$type === validationTypes.wordsAmount;
            })[0];
            var wordsValidationResult = textQuestionSvc.validateWords(wordsAmountValidation.min, wordsAmountValidation.max);
            if (wordsValidationResult.valid === false) {
                return wordsValidationResult;
            }

            var validationResult = {
                valid: true,
                message: ''
            };

            if (question.$type === questionConst.questionTypes.shortTextList) {
                return validationResult;
            }

            var rowsValidationResult = textQuestionSvc.validateRows(question.subQuestionDefinition.rows);
            if (rowsValidationResult.valid === false) {
                return rowsValidationResult;
            }

            return validationResult;
        }
    }
})();