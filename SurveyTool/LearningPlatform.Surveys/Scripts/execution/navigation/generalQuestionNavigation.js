var GeneralQuestionNavigation = (function () {
    var SELECTOR = GLOBAL_CONSTANTS.SELECTOR;
    var CONST = GLOBAL_CONSTANTS.CONST;
    var CLASS_NAMES = GLOBAL_CONSTANTS.CLASS_NAMES;
    var KEY = GLOBAL_CONSTANTS.KEY;

    return {
        isKeepDefaultEvent: isKeepDefaultEvent,
        isOptionHaveOther: isOptionHaveOther
    };

    function isKeepDefaultEvent(event) {
        if (EventUtil.isRelatedTab(event)) return false;
        var parentElement = event.target.parentElement,
            parentElementClass = parentElement.getAttribute('class');

        switch (event.target.type) {
            case CONST.elementType.text:
                if (getKeepDefaultEventForText()) return true;
                break;
            case CONST.elementType.textarea:
                if (getKeepDefaultEventForTextarea()) return true;
                break;
            case CONST.elementType.number:
                if (getKeepDefaultEventForNumber()) return true;
                break;
            case CONST.elementType.select:
            case CONST.elementType.selectOne:
                if (getKeepDefaultEventForSelectOne()) return true;
                break;
            default:
        }

        if (getKeepDefaultEventForOption()) return true;

        if (event.target.type === CONST.elementType.submit) {
            var isShiftTab = event.shiftKey && event.keyCode === KEY.TAB;
            return event.keyCode !== KEY.UP && !isShiftTab;
        }
        return false;

        function getKeepDefaultEventForText() {
            // Note: processing for text in short text question type and other option in single/multiple selection question type
            // Also process for text in short text list
            var cursorPosition = getCursorPositionInTexts(event.target.getAttribute('id')),
                firstQuestionId = 1;
            if (!isHtmlClassContain(parentElementClass, [CLASS_NAMES.shortText, CLASS_NAMES.otherText])) return true;
            if (!IndexModule.selectedQuestion) return true;
            if (ArrayUtil.hasValueIn([KEY.DOWN, KEY.ENTER], event.keyCode)) return false;
            var pressLeftAtFirstPosition = KEY.LEFT === event.keyCode && cursorPosition === 0;
            if (pressLeftAtFirstPosition || KEY.UP === event.keyCode) {
                if (isHtmlClassContain(parentElementClass, [CLASS_NAMES.otherText])) {
                    return false;
                }
                if (IndexModule.selectedQuestion.options && IndexModule.selectedQuestion.options.length > 0) {
                    var firstSelectionOptionId = 1;
                    if (IndexModule.selectedQuestion.selectedOptionId > firstSelectionOptionId) {
                        return false;
                    }
                }
                if (IndexModule.selectedQuestion.id > firstQuestionId) return false;
            }
            if (KEY.RIGHT === event.keyCode && cursorPosition === event.target.value.length) return false;
            return true;
        }

        function isHtmlClassContain(htmlClass, keys) {
            var isContainClass = false,
                splittedHtmlClass = htmlClass.split(' ');
            keys.forEach(function (key) {
                if (key !== '' && splittedHtmlClass.indexOf(key) >= 0) {
                    isContainClass = true;
                    return;
                }
            });
            return isContainClass;
        }

        function getKeepDefaultEventForTextarea() {
            var cursorPosition = getCursorPositionInTexts(event.target.getAttribute('id')),
                firstQuestionId = 1;
            if (parentElementClass.indexOf(CLASS_NAMES.longText) < 0) return true;
            if (ArrayUtil.hasValueIn([KEY.LEFT, KEY.UP], event.keyCode) && cursorPosition === 0) {
                return IndexModule.selectedQuestion && IndexModule.selectedQuestion.id <= firstQuestionId;
            }
            if (ArrayUtil.hasValueIn([KEY.RIGHT, KEY.DOWN], event.keyCode) && cursorPosition === event.target.value.length) return false;
            return true;
        }

        function getCursorPositionInTexts(elementId) {
            // Note: apply for text, textarea
            var element = $('#' + elementId);
            return element[0].value.slice(0, element[0].selectionStart).length;
        }

        function getKeepDefaultEventForNumber() {
            // Note: processing for numeric question type
            if (parentElementClass.indexOf(CLASS_NAMES.numericText) < 0) return true;
            if (ArrayUtil.hasValueIn([KEY.ENTER], event.keyCode)) return false;
            return true;
        }

        function getKeepDefaultEventForSelectOne() {
            // Note: processing for combo box (select, select-one)
            if (KEY.ENTER === event.keyCode) return false;
            return true;
        }

        function getKeepDefaultEventForOption() {
            // Note: processing for radio and checkbox
            if (ArrayUtil.hasValueIn([KEY.UP, KEY.DOWN, KEY.LEFT, KEY.RIGHT, KEY.SPACE, KEY.ENTER], event.keyCode)) {
                return false;
            }

            return true;
        }
    }

    function isOptionHaveOther(question) {
        if (!ArrayUtil.hasValueIn([SELECTOR.question.type.singleSelection,
            SELECTOR.question.type.multiSelection], question.type)) return false;
        var currentOption = question.options[question.selectedOptionId - 1];
        if (!currentOption || !currentOption.optionElement) return false;

        var closetSelector = SELECTOR.question.type.singleSelection === question.type ?
           '.single-selection-other' :
           '.multi-selection.other';

        var textbox = $(currentOption.optionElement.closest(closetSelector)).find('div.other-text input[type="text"]');
        return textbox.length > 0;
    }
})();