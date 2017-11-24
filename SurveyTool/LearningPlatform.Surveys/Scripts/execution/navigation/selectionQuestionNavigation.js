var SelectionQuestionNavigation = (function () {
    var KEY = GLOBAL_CONSTANTS.KEY;

    return {
        navigateDropdownSingleSelection: navigateDropdownSingleSelection,
        navigateInOneDimensionHorizontal: navigateInOneDimensionHorizontal,
        navigateInOneDimensionVertical: navigateInOneDimensionVertical
    };

    function navigateDropdownSingleSelection(event) {
        if (KEY.ENTER !== event.keyCode) return;
        EventUtil.blurOutEventElement(event);
        var timeout = 0,
            isAutoSelectOption = false;
        GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
    }

    function navigateInOneDimensionHorizontal(event) {
        var timeout = 0,
            isAutoSelectOption;
        if (KEY.UP === event.keyCode) {
            isAutoSelectOption = true;
            GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionUp(isAutoSelectOption);
            return;
        }
        if (ArrayUtil.hasValueIn([KEY.DOWN], event.keyCode)) {
            isAutoSelectOption = true;
            GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
            return;
        }
        if (ArrayUtil.hasValueIn([KEY.ENTER], event.keyCode)) {
            isAutoSelectOption = false;
            GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
            return;
        }
        if (KEY.LEFT === event.keyCode) {
            if (IndexModule.selectedQuestion.selectedOptionId > 1) {
                IndexModule.selectedQuestion.selectedOptionId = IndexModule.selectedQuestion.selectedOptionId - 1;
                GeneralQuestionNavigationDesktop.setActiveOption(event);
            } else {
                isAutoSelectOption = true;
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionUp(isAutoSelectOption);
                if (GeneralQuestionNavigation.isOptionHaveOther(IndexModule.selectedQuestion)) {
                    QuestionWithOption.focusOtherTextBySelectedOption(IndexModule.selectedQuestion);
                }
            }
            return;
        }
        if (KEY.RIGHT === event.keyCode) {
            if (IndexModule.selectedQuestion.selectedOptionId < IndexModule.selectedQuestion.options.length) {
                IndexModule.selectedQuestion.selectedOptionId = IndexModule.selectedQuestion.selectedOptionId + 1;
                GeneralQuestionNavigationDesktop.setActiveOption(event);
            } else {
                isAutoSelectOption = true;
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
            }
        }
    }

    function navigateInOneDimensionVertical(event) {
        var optionElement = IndexModule.selectedQuestion.options[IndexModule.selectedQuestion.selectedOptionId - 1].optionElement;
        var timeout = 0,
            isAutoSelectOption;
        if (KEY.LEFT === event.keyCode) {
            if (IndexModule.selectedQuestion.selectedOptionId > 1) {
                IndexModule.selectedQuestion.selectedOptionId--;
                if (GeneralQuestionNavigation.isOptionHaveOther(IndexModule.selectedQuestion)) {
                    QuestionWithOption.focusOtherTextBySelectedOption(IndexModule.selectedQuestion);
                    optionElement = IndexModule.selectedQuestion.options[IndexModule.selectedQuestion.selectedOptionId - 1].optionElement;
                    optionElement.checked = true;
                    GeneralQuestionNavigationDesktop.setActiveOption(event);
                    EventUtil.stopEvent(event);
                } else {
                    GeneralQuestionNavigationDesktop.setActiveOption(event);
                }
            } else {
                isAutoSelectOption = true;
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionUp(isAutoSelectOption);
                if (GeneralQuestionNavigation.isOptionHaveOther(IndexModule.selectedQuestion)) {
                    QuestionWithOption.focusOtherTextBySelectedOption(IndexModule.selectedQuestion);
                }
            }
            return;
        }
        if (KEY.UP === event.keyCode) {
            if (IndexModule.selectedQuestion.selectedOptionId > 1) {
                IndexModule.selectedQuestion.selectedOptionId = IndexModule.selectedQuestion.selectedOptionId - 1;
                GeneralQuestionNavigationDesktop.setActiveOption(event);
            } else {
                isAutoSelectOption = true;
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionUp(isAutoSelectOption);
            }
            return;
        }
        if (KEY.RIGHT === event.keyCode) {
            if (GeneralQuestionNavigation.isOptionHaveOther(IndexModule.selectedQuestion)) {
                QuestionWithOption.focusOtherTextBySelectedOption(IndexModule.selectedQuestion);
                optionElement.checked = true;
                IndexModule.highlightOption(IndexModule.selectedQuestion);
                EventUtil.stopEvent(event);
            } else {
                if (IndexModule.selectedQuestion.selectedOptionId < IndexModule.selectedQuestion.options.length) {
                    IndexModule.selectedQuestion.selectedOptionId = IndexModule.selectedQuestion.selectedOptionId + 1;
                    GeneralQuestionNavigationDesktop.setActiveOption(event);
                } else {
                    isAutoSelectOption = true;
                    GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
                }
            }
            return;
        }
        if (ArrayUtil.hasValueIn([KEY.RIGHT, KEY.DOWN], event.keyCode)) {
            if (IndexModule.selectedQuestion.selectedOptionId < IndexModule.selectedQuestion.options.length) {
                IndexModule.selectedQuestion.selectedOptionId = IndexModule.selectedQuestion.selectedOptionId + 1;
                GeneralQuestionNavigationDesktop.setActiveOption(event);
            } else {
                isAutoSelectOption = true;
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
            }
            return;
        }
        if (KEY.ENTER === event.keyCode) {
            isAutoSelectOption = false;
            GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
        }
    }
})();