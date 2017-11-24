var PageNavigation = (function () {
    var SELECTOR = GLOBAL_CONSTANTS.SELECTOR;
    var KEY = GLOBAL_CONSTANTS.KEY;

    return {
        processOnPageNagivation: processOnPageNagivation
    };

    function processOnPageNagivation(event) {
        var isPrevious = $(event.target).attr('class').indexOf('previous') >= 0,
            isNext = $(event.target).attr('class').indexOf('next') >= 0,
            previousButton = $(SELECTOR.page.previousNavigation),
            nextButton = $(SELECTOR.page.nextNavigation);
        var isAutoSelectOption;

        if (event.shiftKey && event.keyCode === KEY.TAB) {
            isAutoSelectOption = false;
            moveBackToLastQuestion(event, isAutoSelectOption);
        } else if (KEY.UP === event.keyCode) {
            isAutoSelectOption = true;
            moveBackToLastQuestion(event, isAutoSelectOption);
        } else if (isPrevious) {
            if (KEY.LEFT === event.keyCode) {
                isAutoSelectOption = true;
                moveBackToLastQuestion(event, isAutoSelectOption);
            }
            else if (event.keyCode === KEY.RIGHT && nextButton.length > 0) nextButton[0].focus();
        } else if (isNext && event.keyCode === KEY.LEFT) {
            if (previousButton.length > 0) previousButton[0].focus();
            else {
                isAutoSelectOption = true;
                moveBackToLastQuestion(event, isAutoSelectOption);
            }
        }
        event.stopPropagation();
    }

    function moveBackToLastQuestion(event, isAutoSelectOption) {
        EventUtil.blurOutEventElement(event);
        //TODO create function to get last question id in question list
        GeneralQuestionNavigationDesktop.moveQuestion(undefined,
            IndexModule.questions[IndexModule.questions.length - 1].id,
            isAutoSelectOption);
    }
})();