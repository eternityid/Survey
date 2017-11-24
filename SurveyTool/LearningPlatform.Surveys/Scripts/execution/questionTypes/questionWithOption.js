var QuestionWithOption = (function () {
    var CSS = GLOBAL_CONSTANTS.CSS;
    var DIRECTION = GLOBAL_CONSTANTS.DIRECTION;
    var SELECTOR = GLOBAL_CONSTANTS.SELECTOR;
    var CONST = GLOBAL_CONSTANTS.CONST;
    var QUESTION_TYPES = GLOBAL_CONSTANTS.QUESTION_TYPES;

    return {
        setDefaultSelectedOptionId: setDefaultSelectedOptionId,
        getOptionByOtherOption: getOptionByOtherOption,
        getSelectedRatingOptionId: getSelectedRatingOptionId,
        focusOtherTextBySelectedOption: focusOtherTextBySelectedOption,
        selectOptionRenderToButton: selectOptionRenderToButton,
        isValidSelectedOptionId: isValidSelectedOptionId
    };

    function setDefaultSelectedOptionId(question, direction, isAutoSelectOption) {
        var isNeedSelectOption = ArrayUtil.hasValueIn([QUESTION_TYPES.shortTextList,
            QUESTION_TYPES.longTextList,
            QUESTION_TYPES.ratingGrid], question.questionType);
        if (isNeedSelectOption || isAutoSelectOption) {
            question.selectedOptionId = DIRECTION.PREVIOUS === direction ?
                question.endIndex :
                question.startIndex;
            return;
        }
        question.selectedOptionId = question.beforeStartIndex;
    }

    function getOptionByOtherOption(otherOptionEvent, question) {
        //Note: just process when clicking on other option text box
        var options = [],
            textbox = otherOptionEvent.target;
        if (question.type === SELECTOR.question.type.singleSelection) {
            options = $(textbox.closest('div.single-selection-other')).find('input[type=radio]');
        } else if (question.type === SELECTOR.question.type.multiSelection) {
            options = $(textbox.closest('label.multi-selection.other')).find('input[type=checkbox]');
        }

        return options.length > 0 ? options[0] : null;
    }

    function getSelectedRatingOptionId(event) {
        var hiddenRatingValue = $(event.target).closest('td').find('input[type="hidden"].rating').attr('name');
        var parts = hiddenRatingValue.split('_');
        return parseInt('0' + parts[parts.length - 1]);
    }

    function focusOtherTextBySelectedOption(question) {
        var isSingleSelection = question.questionType === QUESTION_TYPES.singleSelection;
        var isMultiSelection = question.questionType === QUESTION_TYPES.multipleSelection;
        if (!isSingleSelection && !isMultiSelection) return;
        var option = question.options[question.selectedOptionId - 1];
        if (option.optionElement.type === 'checkbox' && !option.optionElement.checked) return;

        var closetSelector = isSingleSelection ?
            '.single-selection-other' :
            '.multi-selection.other';

        var textbox = $(option.optionElement.closest(closetSelector)).find('div.other-text input[type="text"]');
        if (textbox.length) {
            textbox.focus();
        }
    }

    function selectOptionRenderToButton(isCheckedOption) {
        if (!IndexModule.selectedQuestion.settings.isRenderOptionByButton || !IndexModule.selectedQuestion || !isCheckedOption) return;

        if (IndexModule.selectedQuestion.type === SELECTOR.question.type.likerScale) {
            IndexModule.selectedQuestion.questionElement.find(SELECTOR.question.likerHeading).removeClass(CONST.selectedLikerButtonClass).removeClass(CSS.option.active).eq(IndexModule.selectedQuestion.selectedOptionId - 1).addClass(CONST.selectedLikerButtonClass);
        } else if (QuestionType.isLikertGridQuestion(IndexModule.selectedQuestion)) {
            IndexModule.selectedQuestion.questionElement.find(SELECTOR.question.likerHeading).removeClass(CONST.selectedLikerButtonClass);
            IndexModule.selectedQuestion.questionElement.find(SELECTOR.question.likerHeading).removeClass(CSS.option.active);
            var allCheckedRadios = IndexModule.selectedQuestion.questionElement.find('input[type="radio"]:checked');
            for (var m = 0; m < allCheckedRadios.length; m++) {
                var radioId = allCheckedRadios[m].id;
                IndexModule.selectedQuestion.questionElement.find('label[for="' + radioId + '"]').parent().addClass(CONST.selectedLikerButtonClass);
            }
        }
    }

    function isValidSelectedOptionId(question) {
        return question.selectedOptionId >= question.startIndex &&
            question.selectedOptionId <= question.endIndex;
    }
})();