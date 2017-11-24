var QuestionWithOptionNavigation = (function () {
    var KEY = GLOBAL_CONSTANTS.KEY;

    return {
        navigateWithInvalidSelectedOptionId: navigateWithInvalidSelectedOptionId
    };

    function navigateWithInvalidSelectedOptionId(question, event) {
        //Invalid option id: out of [startIndex, endIndex]
        var isAutoSelectOption;
        switch (event.keyCode) {
            case KEY.RIGHT:
            case KEY.DOWN:
                question.selectedOptionId++;
                IndexModule.highlightOption(question);
                break;
            case KEY.ENTER:
                var timeout = 0;
                isAutoSelectOption = false;
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
                break;
            default:
                isAutoSelectOption = true;
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionUp(isAutoSelectOption);
        }
    }
})();