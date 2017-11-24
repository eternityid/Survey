var TextQuestionNavigation = (function () {
    var KEY = GLOBAL_CONSTANTS.KEY;

    return {
        navigateShortTextQuestionType: navigateShortTextQuestionType,
        navigateLongTextQuestionType: navigateLongTextQuestionType,
        navigateNumericQuestionType: navigateNumericQuestionType
    };

    function navigateShortTextQuestionType(event) {
        EventUtil.blurOutEventElement(event);

        var timeout = 0,
            isAutoSelectOption;
        switch (event.keyCode) {
            case KEY.LEFT:
            case KEY.UP:
                isAutoSelectOption = true;
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionUp(isAutoSelectOption);
                break;
            case KEY.RIGHT:
            case KEY.DOWN:
                isAutoSelectOption = true;
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
                break;
            case KEY.ENTER:
                isAutoSelectOption = false;
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
        }
    }

    function navigateLongTextQuestionType(event) {
        EventUtil.blurOutEventElement(event);

        var isAutoSelectOption = true;
        switch (event.keyCode) {
            case KEY.LEFT:
            case KEY.UP:
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionUp(isAutoSelectOption);
                break;
            case KEY.RIGHT:
            case KEY.DOWN:
                var timeout = 0;
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
        }
    }

    function navigateNumericQuestionType(event) {
        EventUtil.blurOutEventElement(event);
        if (ArrayUtil.hasValueIn([KEY.ENTER], event.keyCode)) {
            var timeout = 0,
                isAutoSelectOption = false;
            GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
        }
    }
})();