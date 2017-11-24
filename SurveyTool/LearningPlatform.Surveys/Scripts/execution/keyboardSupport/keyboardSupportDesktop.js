(function () {
    var KEY = GLOBAL_CONSTANTS.KEY;
    var CONST = GLOBAL_CONSTANTS.CONST;
    var QUESTION_TYPES = GLOBAL_CONSTANTS.QUESTION_TYPES;

    function onPageKeydown(event) {
        if (IndexModule.selectedQuestion !== null) processOnQuestion();
        else if (isFocusingPageNavigation()) PageNavigation.processOnPageNagivation(event);
        return;

        function processOnQuestion() {
            if (GeneralQuestionNavigation.isKeepDefaultEvent(event)) return;

            if (!event.shiftKey && event.keyCode === KEY.TAB) {
                EventUtil.blurOutEventElement(event);
                processTabKeyOnQuestion();
                return;
            }
            if (event.shiftKey && event.keyCode === KEY.TAB) {
                EventUtil.blurOutEventElement(event);
                processShiftTabKeyOnQuestion();
                return;
            }
            if (!IndexModule.selectedQuestion) return;
            if (ArrayUtil.hasValueIn([KEY.LEFT, KEY.RIGHT, KEY.DOWN, KEY.UP, KEY.ENTER], event.keyCode)) {
                moveOnQuestion();
                return;
            }
            if (KEY.SPACE === event.keyCode) {
                processSpaceKeyOnQuestion();
                return;
            }
            return;

            function processTabKeyOnQuestion() {
                var selectedQuestion = IndexModule.selectedQuestion;
                var isTextList = selectedQuestion.questionType === QUESTION_TYPES.shortTextList
                    || selectedQuestion.questionType === QUESTION_TYPES.longTextList;
                var isAutoSelectOption = false;
                if (isTextList) {
                    GridQuestionNavigationDesktop.goToNextOptionInTextListOrQuestion(selectedQuestion.selectedOptionId, isAutoSelectOption);
                } else {
                    var timeout = 0;
                    GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
                }
                EventUtil.stopEvent(event);
                return;
            }

            function processShiftTabKeyOnQuestion() {
                var selectedQuestion = IndexModule.selectedQuestion;
                var isTextList = selectedQuestion.questionType === QUESTION_TYPES.shortTextList
                    || selectedQuestion.questionType === QUESTION_TYPES.longTextList;
                var isAutoSelectOption = false;
                if (isTextList) {
                    GridQuestionNavigationDesktop.goToPreviousOptionInTextListOrQuestion(event, selectedQuestion.selectedOptionId, isAutoSelectOption);
                } else {
                    var firstQuestionId = 1;
                    if (IndexModule.selectedQuestion.id > firstQuestionId) {
                        GeneralQuestionNavigationDesktop.moveQuestion(IndexModule.selectedQuestion.id,
                            IndexModule.selectedQuestion.id - 1,
                            isAutoSelectOption);
                        if (GeneralQuestionNavigation.isOptionHaveOther(IndexModule.selectedQuestion)) {
                            QuestionWithOption.focusOtherTextBySelectedOption(IndexModule.selectedQuestion);
                        }
                        EventUtil.stopEvent(event);
                    }
                }
                return;
            }

            function moveOnQuestion() {
                if (ArrayUtil.hasValueIn(QuestionType.getQuestionTypeSelectors(IndexModule.CONST.optionType.text), IndexModule.selectedQuestion.type)) {
                    processTextControls();
                } else if (IndexModule.SELECTOR.question.type.singleSelectionDropdown === IndexModule.selectedQuestion.type) {
                    SelectionQuestionNavigation.navigateDropdownSingleSelection(event);
                } else if (IndexModule.SELECTOR.question.type.information === IndexModule.selectedQuestion.type) {
                    processInformationQuestionType();
                } else if (IndexModule.SELECTOR.question.type.ratings === IndexModule.selectedQuestion.type) {
                    RatingQuestionNavigation.navigateRatingQuestionType(event);
                } else {
                    if (QuestionType.isRatingGridQuestion(IndexModule.selectedQuestion)) {
                        RatingQuestionNavigation.navigateRatingGridQuestionType(event);
                    } else {
                        processOptionControls();
                    }
                }
                EventUtil.stopEvent(event);
                return;

                function processTextControls() {
                    switch (IndexModule.selectedQuestion.type) {
                        case IndexModule.SELECTOR.question.type.shortText:
                            TextQuestionNavigation.navigateShortTextQuestionType(event);
                            break;
                        case IndexModule.SELECTOR.question.type.longText:
                            TextQuestionNavigation.navigateLongTextQuestionType(event);
                            break;
                        case IndexModule.SELECTOR.question.type.numericText:
                            TextQuestionNavigation.navigateNumericQuestionType(event);
                            break;
                        default:
                            break;
                    }
                }

                function processInformationQuestionType() {
                    var timeout = 0,
                        isAutoSelectOption;
                    if (ArrayUtil.hasValueIn([KEY.UP, KEY.LEFT], event.keyCode)) {
                        isAutoSelectOption = true;
                        GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionUp(isAutoSelectOption);
                    } else if (ArrayUtil.hasValueIn([KEY.RIGHT, KEY.DOWN], event.keyCode)) {
                        isAutoSelectOption = true;
                        GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
                    } else if (ArrayUtil.hasValueIn([KEY.ENTER], event.keyCode)) {
                        isAutoSelectOption = false;
                        GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
                    }
                }

                function processOptionControls() {
                    //Note: processing for radio, checkbox and text (other option)
                    //Also process for text in short text list, long text list
                    if (!IndexModule.selectedQuestion.options || IndexModule.selectedQuestion.options.length === 0) return;
                    if (!QuestionWithOption.isValidSelectedOptionId(IndexModule.selectedQuestion)) {
                        QuestionWithOptionNavigation.navigateWithInvalidSelectedOptionId(IndexModule.selectedQuestion, event);
                        return;
                    }

                    if (event.target.type === IndexModule.CONST.elementType.text) {
                        GridQuestionNavigationDesktop.navigateTextboxInList(
                            event,
                            event.target.parentElement.classList.contains(IndexModule.CSS.question.type.otherText));
                    } else if (event.target.type === IndexModule.CONST.elementType.textarea) {
                        GridQuestionNavigationDesktop.navigateTextareaInList(event);
                    } else {
                        processRadioCheckbox();
                    }
                    return;

                    function processRadioCheckbox() {
                        switch (IndexModule.selectedQuestion.type) {
                            case IndexModule.SELECTOR.question.type.likerScale:
                                SelectionQuestionNavigation.navigateInOneDimensionHorizontal(event);
                                break;
                            case IndexModule.SELECTOR.question.type.singleSelection:
                            case IndexModule.SELECTOR.question.type.multiSelection:
                                if ($(IndexModule.selectedQuestion.questionElement).find('div.hrow.single-selection').length > 0 ||
                                    $(IndexModule.selectedQuestion.questionElement).find('div.hrow.multi-selection').length > 0) {
                                    SelectionQuestionNavigation.navigateInOneDimensionHorizontal(event);
                                } else {
                                    SelectionQuestionNavigation.navigateInOneDimensionVertical(event);
                                }
                                break;
                            case IndexModule.SELECTOR.question.type.gridSelection:
                                GridQuestionNavigationDesktop.navigateInTwoDimension(event);
                                break;
                            case IndexModule.SELECTOR.question.type.pictureSingleSelection:
                            case IndexModule.SELECTOR.question.type.pictureMultipleSelection:
                                PictureQuestionNavigation.navigateInPictureOptions(event);
                                break;
                            default:
                        }
                    }
                }
            }

            function processSpaceKeyOnQuestion() {
                if (!QuestionWithOption.isValidSelectedOptionId(IndexModule.selectedQuestion)) return;
                var option = IndexModule.selectedQuestion.options[IndexModule.selectedQuestion.selectedOptionId - 1];
                option.optionElement.checked = option.optionElement.type === IndexModule.CONST.elementType.radio ? true : !option.optionElement.checked;
                QuestionWithOption.selectOptionRenderToButton(option.optionElement.checked);
                PictureQuestionDesktop.handleSelectedPictureOption(IndexModule.selectedQuestion);
                GeneralQuestionValidation.handleCheckingValidate(IndexModule.selectedQuestion);
                if (GeneralQuestionValidation.isFinishSingleAnswer(IndexModule.selectedQuestion)) {
                    var delay,
                        isAutoSelectOption = false;
                    GeneralPageDesktop.handleAutoNextOrNextQuestion(delay, isAutoSelectOption);
                } else {
                    if (ArrayUtil.hasValueIn([IndexModule.SELECTOR.question.type.singleSelection,
                        IndexModule.SELECTOR.question.type.multiSelection], IndexModule.selectedQuestion.type)) {
                        QuestionWithOption.focusOtherTextBySelectedOption(IndexModule.selectedQuestion);
                    }

                    if (!GeneralQuestionValidation.isQuestionAnswered(IndexModule.selectedQuestion)) {
                        $('.ok-button').removeClass('show');
                    } else {
                        GeneralQuestion.activateOKButton(IndexModule.selectedQuestion);
                    }
                }
                EventUtil.stopEvent(event);
            }
        }

        function isFocusingPageNavigation() {
            return event.target &&
                event.target.nodeName.toLowerCase() === 'input' &&
                ['back', 'forward'].indexOf(event.target.name) >= 0;
        }
    }

    $(document).ready(function () {
        IndexModule.settingHotkeys = Hotkey.settingHotkeys;

        $(IndexModule.SELECTOR.page.root).keydown(onPageKeydown);
    });
})();