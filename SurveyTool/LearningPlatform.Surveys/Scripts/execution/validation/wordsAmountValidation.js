var WordsAmountValidation = (function () {
    var ERROR_TYPES = GLOBAL_CONSTANTS.ERROR_TYPES;
    var ERROR_MESSAGES = GLOBAL_CONSTANTS.ERROR_MESSAGES;

    return {
        validate: validate
    };

    function validate(question, answers, validation, validationErrors) {
        var value = answers[0].value.trim();
        if (StringUtil.isEmpty(value)) return;
        var wordsAmount = StringUtil.countWords(value);
        if (validation.min !== null && validation.max !== null && (wordsAmount < validation.min || wordsAmount > validation.max)) {
            validationErrors.push({
                type: ERROR_TYPES.questionWordsAmountMinMax,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionWordsAmountMinMax,
                    [validation.min, validation.max])
            });
            return;
        }
        if (validation.min !== null && wordsAmount < validation.min) {
            validationErrors.push({
                type: ERROR_TYPES.questionWordsAmountMin,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionWordsAmountMin,
                    [validation.min])
            });
            return;
        }
        if (validation.max !== null && wordsAmount > validation.max) {
            validationErrors.push({
                type: ERROR_TYPES.questionWordsAmountMax,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionWordsAmountMax,
                    [validation.max])
            });
        }
    }
})();