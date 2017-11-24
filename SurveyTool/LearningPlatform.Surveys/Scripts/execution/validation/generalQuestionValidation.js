var GeneralQuestionValidation = (function () {
    var SELECTOR = GLOBAL_CONSTANTS.SELECTOR;
    var QUESTION_TYPES = GLOBAL_CONSTANTS.QUESTION_TYPES;
    var QUESTION_VALIDATION_TYPES = GLOBAL_CONSTANTS.QUESTION_VALIDATION_TYPES;

    return {
        isFinishSingleAnswer: isFinishSingleAnswer,
        validate: validate,
        isAllQuestionsAnswered: isAllQuestionsAnswered,
        isQuestionAnswered: isQuestionAnswered,
        handleCheckingValidate: handleCheckingValidate,
        handleCheckingValidateForAnsweringQuestion: handleCheckingValidateForAnsweringQuestion
    };

    function isFinishSingleAnswer(question) {
        if (question.type === SELECTOR.question.type.singleSelection) {
            if (question.selectedOptionId <= 0) return false;
        } else {
            if (!QuestionType.isSingleAnswerQuestion(question)) return false;
        }

        switch (question.type) {
            case SELECTOR.question.type.singleSelection:
                return !GeneralQuestion.isSelectOtherTextOption(question);
            case SELECTOR.question.type.likerScale:
            case SELECTOR.question.type.pictureSingleSelection:
                return question.selectedOptionId > 0;
            default:
                return false;
        }
    }

    function validate(question) {
        if (!question.validations) return;
        var answers = GeneralQuestion.getQuestionAnswer(question);
        var validationErrors = [];
        question.validations.forEach(function (validation) {
            switch (validation.validationType) {
                case QUESTION_VALIDATION_TYPES.decimalPlacesNumberValidation:
                    DecimalPlacesNumberValidation.validate(question, answers, validation, validationErrors);
                    break;
                case QUESTION_VALIDATION_TYPES.lengthValidation:
                    LengthValidation.validate(question, answers, validation, validationErrors);
                    break;
                case QUESTION_VALIDATION_TYPES.rangeNumberValidation:
                    RangeNumberValidation.validate(question, answers, validation, validationErrors);
                    break;
                case QUESTION_VALIDATION_TYPES.regularExpressionValidation:
                    break;
                case QUESTION_VALIDATION_TYPES.requiredValidation:
                    RequiredValidation.validate(question, answers, validationErrors);
                    break;
                case QUESTION_VALIDATION_TYPES.selectionValidation:
                    SelectionValidation.validate(question, answers, validation, validationErrors);
                    break;
                case QUESTION_VALIDATION_TYPES.wordsAmountValidation:
                    WordsAmountValidation.validate(question, answers, validation, validationErrors);
                    break;
                default:
                    break;
            }
        });
        var clientValidations = [
            ERROR_TYPES.questionRequired,
            ERROR_TYPES.questionSelectionMinMax,
            ERROR_TYPES.questionSelectionMin,
            ERROR_TYPES.questionSelectionMax,
            ERROR_TYPES.questionLengthMinMax,
            ERROR_TYPES.questionLengthMin,
            ERROR_TYPES.questionLengthMax,
            ERROR_TYPES.questionWordsAmountMinMax,
            ERROR_TYPES.questionWordsAmountMin,
            ERROR_TYPES.questionWordsAmountMax,
            ERROR_TYPES.questionNumberMinMax,
            ERROR_TYPES.questionNumberMin,
            ERROR_TYPES.questionNumberMax,
            ERROR_TYPES.questionNumberDecimalPlaces
        ];

        question.errors = question.errors.filter(function (error) {
            return clientValidations.indexOf(error.type) < 0;
        });

        Array.prototype.push.apply(question.errors, validationErrors);
    }

    function isAllQuestionsAnswered(questions) {
        return questions.every(function (question) {
            return isQuestionAnswered(question) === true;
        });
    }

    function isQuestionAnswered(question) {
        var isValid = false;
        var answers = GeneralQuestion.getQuestionAnswer(question);
        switch (question.questionType) {
            case QUESTION_TYPES.information:
                isValid = true;
                break;
            case QUESTION_TYPES.shortText:
            case QUESTION_TYPES.longText:
            case QUESTION_TYPES.numeric:
            case QUESTION_TYPES.date:
            case QUESTION_TYPES.netPromoterScore:
                isValid = !StringUtil.isEmpty(answers[0].value);
                break;
            case QUESTION_TYPES.singleSelection:
                if (question.type === SELECTOR.question.type.singleSelectionDropdown) {
                    isValid = !StringUtil.isEmpty(answers[0].value);
                } else {
                    isValid = SelectionValidation.isSingleQuestionAnswered(question, answers);
                }
                break;
            case QUESTION_TYPES.rating:
                isValid = !StringUtil.isEmpty(answers[0].value) && answers[0].value !== '0';
                break;
            case QUESTION_TYPES.scale:
            case QUESTION_TYPES.scaleGrid:
            case QUESTION_TYPES.singleSelectionGrid:
            case QUESTION_TYPES.pictureSingleSelection:
                isValid = answers.length > 0;
                break;
            case QUESTION_TYPES.multipleSelection:
                isValid = SelectionValidation.isMultipleQuestionAnswered(answers);
                break;
            case QUESTION_TYPES.multipleSelectionGrid:
            case QUESTION_TYPES.pictureMultipleSelection:
                isValid = answers.some(function (answer) {
                    return answer.value === true || answer.value === 'true';
                });
                break;
            case QUESTION_TYPES.shortTextList:
            case QUESTION_TYPES.longTextList:
                isValid = answers.some(function (answer) {
                    return !StringUtil.isEmpty(answer.value);
                });
                break;
            case QUESTION_TYPES.ratingGrid:
                isValid = answers.some(function (answer) {
                    return !StringUtil.isEmpty(answer.value) && answer.value !== '0';
                });
                break;
            default:
                break;
        }
        return isValid;
    }

    function handleCheckingValidate(question) {
        if (!GeneralQuestion.isErrorMessageEmpty(question)) {
            validate(question);
            if (question.errors && question.errors.length > 0) {
                GeneralQuestion.replaceQuestionErrorMessage(question);
                IndexModule.highlightQuestion(question);
            } else {
                GeneralQuestion.clearQuestionErrorMessage(question);
            }
        }
    }

    function handleCheckingValidateForAnsweringQuestion(question) {
        if (!GeneralQuestion.isErrorMessageEmpty(question)) {
            validate(question);
            if (question.errors && question.errors.length > 0) {
                GeneralQuestion.replaceQuestionErrorMessage(question);
            } else {
                GeneralQuestion.clearQuestionErrorMessage(question);
            }
        }
    }
})();