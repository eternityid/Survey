var GeneralQuestionNavigationDesktop = (function () {
    var DIRECTION = GLOBAL_CONSTANTS.DIRECTION;
    var SELECTOR = GLOBAL_CONSTANTS.SELECTOR;
    var CONST = GLOBAL_CONSTANTS.CONST;

    return {
        handleMoveSelectedQuestionUp: handleMoveSelectedQuestionUp,
        handleMoveSelectedQuestionDown: handleMoveSelectedQuestionDown,
        moveQuestion: moveQuestion,
        setActiveOption: setActiveOption,
        moveToNavigation: moveToNavigation
    };

    function handleMoveSelectedQuestionUp(isAutoSelectOption) {
        if (IndexModule.selectedQuestion === null) return;
        var previousQuestion = GeneralQuestion.getPreviousQuestion(
            IndexModule.questions, IndexModule.selectedQuestion.id);
        if (previousQuestion !== null) {
            moveQuestion(IndexModule.selectedQuestion.id, previousQuestion.id, isAutoSelectOption);
        }
    }

    var moveSelectedTimeout;

    function handleMoveSelectedQuestionDown(timeout, isAutoSelectOption) {
        //TODO do we need timeout for desktop device? (Ask Thai about this)
        //Note: can move to next question or navigation buttons
        var time = timeout === undefined ? 0 : timeout;
        if (moveSelectedTimeout) {
            window.clearTimeout(moveSelectedTimeout);
        }
        moveSelectedTimeout = setTimeout(function () {
            if (IndexModule.selectedQuestion === null) return;
            var nextQuestion = GeneralQuestion.getNextQuestion(IndexModule.questions, IndexModule.selectedQuestion.id);
            var nextQuestionId = nextQuestion !== null ? nextQuestion.id : undefined;
            moveQuestion(IndexModule.selectedQuestion.id, nextQuestionId, isAutoSelectOption);
            moveSelectedTimeout = null;
        }, time);
    }

    function moveQuestion(orginalQuestionId, destinationQuestionId, isAutoSelectOption) {
        // Just move from question to question or question to navigation
        if (destinationQuestionId === undefined) {
            GeneralQuestionNavigationDesktop.moveToNavigation();
        } else {
            moveToAnotherQuestion();
        }
        return;

        function moveToAnotherQuestion() {
            if (orginalQuestionId !== undefined) GeneralQuestionDesktop.deactiveQuestion(orginalQuestionId);
            var nextWorkingQuestion = GeneralQuestion.getQuestionById(destinationQuestionId);
            IndexModule.highlightQuestion(nextWorkingQuestion);
            if (nextWorkingQuestion.options) {
                QuestionWithOption.setDefaultSelectedOptionId(nextWorkingQuestion, getDirection(), isAutoSelectOption);
                IndexModule.highlightOption(nextWorkingQuestion);
            }
            GeneralQuestion.focusAnswer(nextWorkingQuestion);
        }

        function getDirection() {
            if (orginalQuestionId === undefined) return DIRECTION.PREVIOUS;
            return destinationQuestionId < orginalQuestionId ? DIRECTION.PREVIOUS : DIRECTION.NEXT;
        }
    }

    function setActiveOption(event) {
        IndexModule.highlightOption(IndexModule.selectedQuestion);
        EventUtil.stopEvent(event);
    }

    function moveToNavigation() {
        if (IndexModule.selectedQuestion === null) return;
        GeneralQuestion.handleUpdateQuestionAnswer(IndexModule.selectedQuestion);
        GeneralQuestionDesktop.deactiveQuestion(IndexModule.selectedQuestion.id);
        MobileRenderUtil.activatePage($('.next-page'));
        $(SELECTOR.page.nextNavigation).focus();
        RenderUtil.moveTop(CONST.movingElementType.navigation, $(SELECTOR.page.nextNavigation));
        IndexModule.selectedQuestion = null;
    }
})();