var LengthValidation = (function () {
    var ERROR_TYPES = GLOBAL_CONSTANTS.ERROR_TYPES;
    var ERROR_MESSAGES = GLOBAL_CONSTANTS.ERROR_MESSAGES;

    return {
        validate: validate
    };

    function validate(question, answers, validation, validationErrors) {
        var value = answers[0].value.trim();
        if (StringUtil.isEmpty(value)) return;
        if (validation.min !== null && validation.max !== null && (value.length < validation.min || value.length > validation.max)) {
            validationErrors.push({
                type: ERROR_TYPES.questionLengthMinMax,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionLengthMinMax,
                    [validation.min, validation.max])
            });
            return;
        }
        if (validation.min !== null && value.length < validation.min) {
            validationErrors.push({
                type: ERROR_TYPES.questionLengthMin,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionLengthMin,
                    [validation.min])
            });
            return;
        }
        if (validation.max !== null && value.length > validation.max) {
            validationErrors.push({
                type: ERROR_TYPES.questionLengthMax,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionLengthMax,
                    [validation.max])
            });
        }
    }
})();