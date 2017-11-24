var RequiredValidation = (function () {
    var SELECTOR = GLOBAL_CONSTANTS.SELECTOR;
    var QUESTION_TYPES = GLOBAL_CONSTANTS.QUESTION_TYPES;
    var ERROR_TYPES = GLOBAL_CONSTANTS.ERROR_TYPES;
    var ERROR_MESSAGES = GLOBAL_CONSTANTS.ERROR_MESSAGES;

    return {
        validate: validate
    };

    function validate(question, answers, validationErrors) {
        switch (question.type) {
            case SELECTOR.question.type.shortText:
            case SELECTOR.question.type.longText:
            case SELECTOR.question.type.numericText:
            case SELECTOR.question.type.date:
            case SELECTOR.question.type.singleSelectionDropdown:
                validateInputsRequired(question, answers, validationErrors);
                break;
            case SELECTOR.question.type.ratings:
                validateRatingRequired(question, answers, validationErrors);
                break;
            case SELECTOR.question.type.likerScale:
            case SELECTOR.question.type.singleSelection:
            case SELECTOR.question.type.pictureSingleSelection:
                validateRadioListRequired(question, answers, validationErrors);
                break;
            case SELECTOR.question.type.pictureMultipleSelection:
            case SELECTOR.question.type.multiSelection:
                validateCheckboxListRequired(question, answers, validationErrors);
                break;
            case SELECTOR.question.type.gridSelection:
                validateGridRequired(question, answers, validationErrors);
                break;
            default:
                break;
        }
    }

    function validateInputsRequired(question, answers, validationErrors) {
        if (StringUtil.isEmpty(answers[0].value)) {
            validationErrors.push({
                type: ERROR_TYPES.questionRequired,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionRequired)
            });
        }
    }

    function validateRatingRequired(question, answers, validationErrors) {
        if (StringUtil.isEmpty(answers[0].value) || answers[0].value === '0') {
            validationErrors.push({
                type: ERROR_TYPES.questionRequired,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionRequired)
            });
        }
    }

    function validateRadioListRequired(question, answers, validationErrors) {
        if (answers.length === 0) {
            validationErrors.push({
                type: ERROR_TYPES.questionRequired,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionRequired)
            });
        }
    }

    function validateCheckboxListRequired(question, answers, validationErrors) {
        var isAnswered = answers.some(function (answer) {
            return answer.value === true || answer.value === 'true';
        });
        if (!isAnswered) {
            validationErrors.push({
                type: ERROR_TYPES.questionRequired,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionRequired)
            });
        }
    }

    function validateGridRequired(question, answers, validationErrors) {
        if (!question.questionType) return;
        switch (question.questionType) {
            case QUESTION_TYPES.singleSelectionGrid:
            case QUESTION_TYPES.scaleGrid:
                validateSingleSelectionGridRequired(question, answers, validationErrors);
                break;
            case QUESTION_TYPES.ratingGrid:
                validateRatingGridRequired(question, answers, validationErrors);
                break;
            case QUESTION_TYPES.multipleSelectionGrid:
                validateMultipleSelectionGridRequired(question, answers, validationErrors);
                break;
            case QUESTION_TYPES.shortTextList:
                validateShortTextListRequired(question, answers, validationErrors);
                break;
            case QUESTION_TYPES.longTextList:
                validateLongTextListRequired(question, answers, validationErrors);
                break;
            default:
                break;
        }
    }

    function validateSingleSelectionGridRequired(question, answers, validationErrors) {
        var radiosName = GridQuestion.getRadiosName(question);
        var isValid = radiosName.every(function (radioName) {
            return answers.some(function (answer) {
                return answer.name === radioName;
            });
        });
        if (!isValid) {
            validationErrors.push({
                type: ERROR_TYPES.questionRequired,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionRequired)
            });
        }
    }

    function validateRatingGridRequired(question, answers, validationErrors) {
        var hiddensName = GridQuestion.getRatingHiddensName(question);
        var isValid = hiddensName.every(function (hiddenName) {
            return answers.some(function (answer) {
                return answer.name === hiddenName &&
                    answer.value !== '' &&
                    answer.value !== '0';
            });
        });
        if (!isValid) {
            validationErrors.push({
                type: ERROR_TYPES.questionRequired,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionRequired)
            });
        }
    }

    function validateMultipleSelectionGridRequired(question, answers, validationErrors) {
        var topicsName = getMultipleSelectionGridTopicsName(question);
        var isValid = topicsName.every(function (topicName) {
            return answers.some(function (answer) {
                return getMultipleSelectionGridTopicName(answer.name) === topicName &&
                    (answer.value === true || answer.value === 'true');
            });
        });
        if (!isValid) {
            validationErrors.push({
                type: ERROR_TYPES.questionRequired,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionRequired)
            });
        }
    }

    function getMultipleSelectionGridTopicsName(question) {
        var checkboxesName = GridQuestion.getCheckboxesName(question);
        var topicsName = [];
        checkboxesName.forEach(function (name) {
            var topicName = getMultipleSelectionGridTopicName(name);
            if (topicsName.indexOf(topicName) < 0) {
                topicsName.push(topicName);
            }
        });
        return topicsName;
    }

    function getMultipleSelectionGridTopicName(checkboxName) {
        var splittedName = checkboxName.split('_');
        splittedName.pop();
        splittedName.push('');
        return splittedName.join('_');
    }

    function validateShortTextListRequired(question, answers, validationErrors) {
        var textsName = GridQuestion.getTextsName(question);
        var isValid = textsName.every(function (textName) {
            return answers.some(function (answer) {
                return answer.name === textName &&
                    !StringUtil.isEmpty(answer.value);
            });
        });
        if (!isValid) {
            validationErrors.push({
                type: ERROR_TYPES.questionRequired,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionRequired)
            });
        }
    }

    function validateLongTextListRequired(question, answers, validationErrors) {
        var textareasName = GridQuestion.getTextareasName(question);
        var isValid = textareasName.every(function (textareaName) {
            return answers.some(function (answer) {
                return answer.name === textareaName &&
                    !StringUtil.isEmpty(answer.value);
            });
        });
        if (!isValid) {
            validationErrors.push({
                type: ERROR_TYPES.questionRequired,
                message: StringUtil.formatByArray(ERROR_MESSAGES.questionRequired)
            });
        }
    }
})();