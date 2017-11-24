var DecimalPlacesNumberValidation = (function () {
    var ERROR_TYPES = GLOBAL_CONSTANTS.ERROR_TYPES;
    var ERROR_MESSAGES = GLOBAL_CONSTANTS.ERROR_MESSAGES;

    return {
        validate: validate
    };

    function validate(question, answers, validation, validationErrors) {
        if (StringUtil.isEmpty(answers[0].value)) return;
        var formattedValues = answers[0].value.replace(',', '.').split('.');
        var decimalPlace = formattedValues.length === 1 ? 0 : formattedValues.pop().length;
        if (decimalPlace > validation.decimalPlaces) {
            validationErrors.push({
                type: ERROR_TYPES.questionNumberDecimalPlaces,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionNumberDecimalPlaces,
                    [validation.decimalPlaces, answers[0].value])
            });
        }
    }
})();