var RangeNumberValidation = (function () {
    var ERROR_TYPES = GLOBAL_CONSTANTS.ERROR_TYPES;
    var ERROR_MESSAGES = GLOBAL_CONSTANTS.ERROR_MESSAGES;

    return {
        validate: validate
    };

    function validate(question, answers, validation, validationErrors) {
        if (StringUtil.isEmpty(answers[0].value)) return;
        var numberAnswer = parseFloat(answers[0].value);
        if (validation.min !== null && validation.max !== null && (numberAnswer < validation.min || numberAnswer > validation.max)) {
            validationErrors.push({
                type: ERROR_TYPES.questionNumberMinMax,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionNumberMinMax,
                    [validation.min, validation.max])
            });
            return;
        }
        if (validation.min !== null && numberAnswer < validation.min) {
            validationErrors.push({
                type: ERROR_TYPES.questionNumberMin,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionNumberMin,
                    [validation.min])
            });
            return;
        }
        if (validation.max !== null && numberAnswer > validation.max) {
            validationErrors.push({
                type: ERROR_TYPES.questionNumberMax,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionNumberMax,
                    [validation.max])
            });
        }
    }
})();