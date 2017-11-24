var SelectionValidation = (function () {
    var ERROR_TYPES = GLOBAL_CONSTANTS.ERROR_TYPES;
    var ERROR_MESSAGES = GLOBAL_CONSTANTS.ERROR_MESSAGES;

    return {
        validate: validate,
        isMultipleQuestionAnswered: isMultipleQuestionAnswered,
        isSingleQuestionAnswered: isSingleQuestionAnswered
    };

    function validate(question, answers, validation, validationErrors) {
        if (StringUtil.isEmpty(answers[0].value)) return;
        var countAnswers = answers.filter(function (answer) {
            return answer.value === true || answer.value === 'true';
        }).length;
        if (validation.min !== null && validation.max !== null && (countAnswers < validation.min || countAnswers > validation.max)) {
            validationErrors.push({
                type: ERROR_TYPES.questionSelectionMinMax,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionSelectionMinMax,
                    [validation.min, validation.max])
            });
            return;
        }
        if (validation.min !== null && countAnswers < validation.min) {
            validationErrors.push({
                type: ERROR_TYPES.questionSelectionMin,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionSelectionMin,
                    [validation.min])
            });
            return;
        }
        if (validation.max !== null && countAnswers > validation.max) {
            validationErrors.push({
                type: ERROR_TYPES.questionSelectionMax,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionSelectionMax,
                    [validation.max])
            });
        }
    }

    function isMultipleQuestionAnswered(answers) {
        var isValid = answers.some(function (answer) {
            var isAnswerChecked = false;
            try {
                isAnswerChecked = JSON.parse(answer.value);
            }
            catch (e) {
                isAnswerChecked = null;
            }

            var optionContainer = $('#' + answer.name).closest('.multi-selection');
            if (!isAnswerChecked || !optionContainer.length) return false;

            var isOtherOption = optionContainer.hasClass('other');
            if (!isOtherOption) return isAnswerChecked;

            var checkedOtherOptionInput = optionContainer.find('.other-text input[type=text]');
            return isAnswerChecked && checkedOtherOptionInput.val();
        });
        return isValid;
    }

    function isSingleQuestionAnswered(question, answers) {
        return answers.some(function (answer) {
            var selectedOptionTextBoxContainer = $(`#${answer.alias}_${answer.value}`, question.questionElement)
                .closest('.single-selection')
                .next('.other');
            if (!selectedOptionTextBoxContainer.length) return answer.value ? true : false;

            var selectedOptionTextBox = selectedOptionTextBoxContainer.find('input[type=text]');
            return selectedOptionTextBox.val().trim() ? true : false;
        });
    }
})();