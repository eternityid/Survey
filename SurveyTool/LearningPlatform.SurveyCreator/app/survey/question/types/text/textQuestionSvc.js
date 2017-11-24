(function () {
    angular.module('svt').service('textQuestionSvc', TextQuestionSvc);

    TextQuestionSvc.$inject = ['stringUtilSvc', 'numberUtilSvc', 'serverValidationSvc', 'questionConst'];

    function TextQuestionSvc(stringUtilSvc, numberUtilSvc, serverValidationSvc, questionConst) {
        var validationTypes = serverValidationSvc.getServerValidationTypes();
        var service = {
            validateCharacters: validateCharacters,
            validateWords: validateWords,
            validateMinWords: validateMinWords,
            validateMaxWords: validateMaxWords,
            validateRows: validateRows,
            validate: validate
        };
        return service;

        function validateCharacters(minCharacters, maxCharacters) {
            var minCharactersValidationResult = validateMinCharacters(minCharacters);
            if (minCharactersValidationResult.valid === false) {
                return minCharactersValidationResult;
            }

            var maxCharactersValidationResult = validateMaxCharacters(maxCharacters);
            if (maxCharactersValidationResult.valid === false) {
                return maxCharactersValidationResult;
            }

            var validationResult = {
                valid: true,
                message: ''
            };

            if (stringUtilSvc.isEmpty(minCharacters) || stringUtilSvc.isEmpty(maxCharacters)) {
                return validationResult;
            }

            if (parseInt(minCharacters) > parseInt(maxCharacters)) {
                validationResult.valid = false;
                validationResult.message = 'Minimum characters should be lower than Maximum characters.';
                return validationResult;
            }

            return validationResult;
        }

        function validateMinCharacters(minCharacters) {
            var validationResult = {
                valid: true,
                message: ''
            };

            if (stringUtilSvc.isEmpty(minCharacters)) {
                return validationResult;
            }

            var MIN_CHARACTERS = 0;
            if (!numberUtilSvc.isInteger(minCharacters) || parseInt(minCharacters) < MIN_CHARACTERS) {
                validationResult.valid = false;
                validationResult.message = 'Minimum characters is invalid.';
                return validationResult;
            }

            return validationResult;
        }

        function validateMaxCharacters(maxCharacters) {
            var validationResult = {
                valid: true,
                message: ''
            };

            if (stringUtilSvc.isEmpty(maxCharacters)) {
                return validationResult;
            }

            var MAX_CHARACTERS = 1;
            if (!numberUtilSvc.isInteger(maxCharacters) || parseInt(maxCharacters) < MAX_CHARACTERS) {
                validationResult.valid = false;
                validationResult.message = 'Maximum characters is invalid.';
                return validationResult;
            }

            return validationResult;
        }

        function validateWords(minWords, maxWords) {
            var minWordsValidationResult = validateMinWords(minWords);
            if (minWordsValidationResult.valid === false) {
                return minWordsValidationResult;
            }

            var maxWordsValidationResult = validateMaxWords(maxWords);
            if (maxWordsValidationResult.valid === false) {
                return maxWordsValidationResult;
            }

            var validationResult = {
                valid: true,
                message: ''
            };

            if (stringUtilSvc.isEmpty(minWords) || stringUtilSvc.isEmpty(maxWords)) {
                return validationResult;
            }

            if (parseInt(minWords) > parseInt(maxWords)) {
                validationResult.valid = false;
                validationResult.message = 'Minimum words should be lower than Maximum words.';
                return validationResult;
            }

            return validationResult;
        }

        function validateMinWords(minWords) {
            var validationResult = {
                valid: true,
                message: ''
            };

            if (stringUtilSvc.isEmpty(minWords)) {
                return validationResult;
            }

            var MIN_WORDS = 0;
            if (!numberUtilSvc.isInteger(minWords) || parseInt(minWords) < MIN_WORDS) {
                validationResult.valid = false;
                validationResult.message = 'Minimum words is invalid.';
                return validationResult;
            }

            return validationResult;
        }

        function validateMaxWords(maxWords) {
            var validationResult = {
                valid: true,
                message: ''
            };

            if (stringUtilSvc.isEmpty(maxWords)) {
                return validationResult;
            }

            var MAX_WORDS = 1;
            if (!numberUtilSvc.isInteger(maxWords) || parseInt(maxWords) < MAX_WORDS) {
                validationResult.valid = false;
                validationResult.message = 'Maximumn words is invalid.';
                return validationResult;
            }

            return validationResult;
        }

        function validateRows(rows) {
            var validationResult = {
                valid: true,
                message: ''
            };

            if (stringUtilSvc.isEmpty(rows) || !numberUtilSvc.isInteger(rows)) {
                validationResult.valid = false;
                validationResult.message = 'Rows amount is invalid.';
                return validationResult;
            }

            var MIN_ROWS = 1,
                MAX_ROWS = 100;
            if (parseInt(rows) < MIN_ROWS || parseInt(rows) > MAX_ROWS) {
                validationResult.valid = false;
                validationResult.message = 'Rows should be in range from ' + MIN_ROWS + ' to ' + MAX_ROWS + '.';
                return validationResult;
            }

            return validationResult;
        }

        function validate(question) {
            var lengthValidation = question.validations.filter(function (validation) {
                return validation.$type === validationTypes.length;
            })[0];
            if (lengthValidation) {
                var charactersValidationResult = validateCharacters(lengthValidation.min, lengthValidation.max);
                if (charactersValidationResult.valid === false) {
                    return charactersValidationResult;
                }
            }

            var wordsAmountValidation = question.validations.filter(function (validation) {
                return validation.$type === validationTypes.wordsAmount;
            })[0];
            if (wordsAmountValidation) {
                var wordsValidationResult = validateWords(wordsAmountValidation.min, wordsAmountValidation.max);
                if (wordsValidationResult.valid === false) {
                    return wordsValidationResult;
                }
            }

            if (lengthValidation && wordsAmountValidation) {
                var message = '';
                if (lengthValidation.min !== '' && wordsAmountValidation.min !== '' && parseInt(lengthValidation.min) < parseInt(wordsAmountValidation.min)) {
                    message = 'Minimum words should be lower than or equal to minimum characters.';
                } else if (lengthValidation.max !== '') {
                    if (wordsAmountValidation.min !== '' && parseInt(lengthValidation.max) < parseInt(wordsAmountValidation.min)) {
                        message = 'Maximum characters should be greater than or equal to minimum words.';
                    } else if (wordsAmountValidation.max !== '' && parseInt(lengthValidation.max) < parseInt(wordsAmountValidation.max)) {
                        message = 'Maximum words should be lower than or equal to maximum characters.';
                    }
                }
                if (message !== '') {
                    return {
                        valid: false,
                        message: message
                    };
                }
            }

            var validationResult = {
                valid: true,
                message: ''
            };

            if (question.$type === questionConst.questionTypes.shortText) {
                return validationResult;
            }

            var rowsValidationResult = validateRows(question.rows);
            if (rowsValidationResult.valid === false) {
                return rowsValidationResult;
            }

            return validationResult;
        }
    }
})();