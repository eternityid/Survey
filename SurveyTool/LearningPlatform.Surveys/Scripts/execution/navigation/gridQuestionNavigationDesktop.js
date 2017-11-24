var GridQuestionNavigationDesktop = (function () {
    var KEY = GLOBAL_CONSTANTS.KEY;

    return {
        navigateTextboxInList: navigateTextboxInList,
        navigateTextareaInList: navigateTextareaInList,
        navigateInTwoDimension: navigateInTwoDimension,
        goToPreviousOptionInTextListOrQuestion: goToPreviousOptionInTextListOrQuestion,
        goToNextOptionInTextListOrQuestion: goToNextOptionInTextListOrQuestion
    };

    function navigateTextboxInList(event, isOtherOption) {
        var selectedOptionId = IndexModule.selectedQuestion.selectedOptionId;
        var isAutoSelectOption;
        switch (event.keyCode) {
            case KEY.LEFT:
                isAutoSelectOption = true;
                if (isOtherOption) processLeftOnOtherOption(selectedOptionId);
                else goToPreviousOptionInTextListOrQuestion(event, selectedOptionId, isAutoSelectOption);
                break;
            case KEY.UP:
                isAutoSelectOption = true;
                goToPreviousOptionInTextListOrQuestion(event, selectedOptionId, isAutoSelectOption);
                break;
            case KEY.RIGHT:
            case KEY.DOWN:
                isAutoSelectOption = true;
                goToNextOptionInTextListOrQuestion(selectedOptionId, isAutoSelectOption);
                break;
            case KEY.ENTER:
                isAutoSelectOption = false;
                goToNextOptionInTextListOrQuestion(selectedOptionId, isAutoSelectOption);
                break;
            default:
        }
        EventUtil.blurOutEventElement(event);
        return;

        function processLeftOnOtherOption(optionId) {
            IndexModule.selectedQuestion.selectedOptionId = optionId;
            IndexModule.highlightOption(IndexModule.selectedQuestion);
        }
    }

    function navigateTextareaInList(event) {
        var selectedOptionId = IndexModule.selectedQuestion.selectedOptionId;
        switch (event.keyCode) {
            case KEY.LEFT:
            case KEY.UP:
                goToPreviousOptionInTextListOrQuestion(event, selectedOptionId);
                break;
            case KEY.RIGHT:
            case KEY.DOWN:
                var isAutoSelectOption = true;
                goToNextOptionInTextListOrQuestion(selectedOptionId, isAutoSelectOption);
                break;
            default:
        }
        EventUtil.blurOutEventElement(event);
    }

    function navigateInTwoDimension(event) {
        var timeout = 0,
            isAutoSelectOption;
        if (KEY.LEFT === event.keyCode) {
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
            return;
        }
        var questionNumberInRow = GridQuestion.countOptionsInRow(IndexModule.selectedQuestion, event.target.type, event.target);
        if (KEY.UP === event.keyCode) {
            if (IndexModule.selectedQuestion.selectedOptionId <= questionNumberInRow) {
                isAutoSelectOption = true;
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionUp(isAutoSelectOption);
            } else {
                IndexModule.selectedQuestion.selectedOptionId -= questionNumberInRow;
                GeneralQuestionNavigationDesktop.setActiveOption(event);
            }
            return;
        }
        if (KEY.DOWN === event.keyCode) {
            if (IndexModule.selectedQuestion.selectedOptionId + questionNumberInRow > IndexModule.selectedQuestion.options.length) {
                isAutoSelectOption = true;
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
            } else {
                IndexModule.selectedQuestion.selectedOptionId += questionNumberInRow;
                GeneralQuestionNavigationDesktop.setActiveOption(event);
            }
        }
        return;
    }

    function goToPreviousOptionInTextListOrQuestion(event, optionId, isAutoSelectOption) {
        if (optionId <= 0) return;
        if (optionId > 1) {
            IndexModule.selectedQuestion.selectedOptionId = optionId - 1;
            IndexModule.highlightOption(IndexModule.selectedQuestion);
            GeneralQuestion.focusAnswer(IndexModule.selectedQuestion);
        } else GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionUp(isAutoSelectOption);
        EventUtil.stopEvent(event);
    }

    function goToNextOptionInTextListOrQuestion(optionId, isAutoSelectOption) {
        if (optionId <= 0) return;
        if (optionId < IndexModule.selectedQuestion.options.length) {
            IndexModule.selectedQuestion.selectedOptionId = optionId + 1;
            IndexModule.highlightOption(IndexModule.selectedQuestion);
            GeneralQuestion.focusAnswer(IndexModule.selectedQuestion);
        } else {
            var timeout = 0;
            GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
        }
    }
})();