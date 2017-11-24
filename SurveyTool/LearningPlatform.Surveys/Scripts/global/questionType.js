var QuestionType = (function () {
    var SELECTOR = GLOBAL_CONSTANTS.SELECTOR;
    var CONST = GLOBAL_CONSTANTS.CONST;
    var QUESTION_TYPES = GLOBAL_CONSTANTS.QUESTION_TYPES;

    return {
        isRatingGridQuestion: isRatingGridQuestion,
        isLikertGridQuestion: isLikertGridQuestion,
        getQuestionTypeSelectors: getQuestionTypeSelectors,
        getQuestionType: getQuestionType,
        isSingleAnswerQuestion: isSingleAnswerQuestion
    };

    function isRatingGridQuestion(selectedQuestion) {
        return isRatingOrLikertGridQuestion(selectedQuestion, 'table.rating-table');
    }

    function isRatingOrLikertGridQuestion(selectedQuestion, tableSelectorKey) {
        if (SELECTOR.question.type.gridSelection !== selectedQuestion.type) return false;
        if (selectedQuestion.options.length === 0) return false;
        var questionElement = selectedQuestion.questionElement;
        if (!questionElement) return false;
        return $(questionElement).find('div.inputArea ' + tableSelectorKey).length > 0;
    }

    function isLikertGridQuestion(selectedQuestion) {
        return isRatingOrLikertGridQuestion(selectedQuestion, 'table.likert-table');
    }

    function getQuestionTypeSelectors(optionType) {
        var values = [];
        for (var key in SELECTOR.question.type) {
            if (SELECTOR.question.type.hasOwnProperty(key)) {
                values.push(SELECTOR.question.type[key]);
            }
        }
        //TODO can use switch ... case here
        if (!optionType) {
            return values;
        }
        if (optionType === CONST.optionType.text) {
            return values.filter(function (type) {
                return type.indexOf('-text') > 0;
            });
        }
        if (optionType === CONST.optionType.select) {
            return values.filter(function (type) {
                return type.indexOf(SELECTOR.question.type.singleSelection) >= 0
                   || type.indexOf(SELECTOR.question.type.multiSelection) >= 0
                   || type.indexOf(SELECTOR.question.type.likerScale) >= 0
                   || type.indexOf(SELECTOR.question.type.gridSelection) >= 0;
            });
        }
        return values.filter(function (type) {
            return type.indexOf(SELECTOR.question.type.unknown) >= 0;
        });
    }

    function getQuestionType(questionElement) {
        var types = getQuestionTypeSelectors(undefined);
        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            if (questionElement.find(type).length > 0) {
                return type;
            }
        }
        return '';
    }

    function isSingleAnswerQuestion(question) {
        switch (question.questionType) {
            case QUESTION_TYPES.scale:
            case QUESTION_TYPES.date:
            case QUESTION_TYPES.netPromoterScore:
            case QUESTION_TYPES.pictureSingleSelection:
                return true;
            case QUESTION_TYPES.singleSelection:
                if (question.questionElement.find('div.horizontal.single-selection-container').length > 0) return true;
                return question.questionElement.find('div.other-text').length <= 0;
            default:
                return false;
        }
    }
})();