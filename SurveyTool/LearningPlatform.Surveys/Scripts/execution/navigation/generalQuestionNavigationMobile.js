var GeneralQuestionNavigationMobile = (function () {
    var DIRECTION = GLOBAL_CONSTANTS.DIRECTION;
    var SELECTOR = GLOBAL_CONSTANTS.SELECTOR;
    var CONST = GLOBAL_CONSTANTS.CONST;

    return {
        handleMoveSelectedQuestionUp: handleMoveSelectedQuestionUp,
        handleMoveSelectedQuestionDown: handleMoveSelectedQuestionDown,
        moveQuestion: moveQuestion,
        moveToNavigation: moveToNavigation
    };

    function handleMoveSelectedQuestionUp() {
        if (IndexModule.selectedQuestion === null) return;
        var previousQuestion = GeneralQuestion.getPreviousQuestion(
            IndexModule.questions, IndexModule.selectedQuestion.id);
        if (previousQuestion !== null) {
            moveQuestion(IndexModule.selectedQuestion.id, previousQuestion.id);
        }
    }

    var moveSelectedTimeout;

    function handleMoveSelectedQuestionDown(timeout) {
        //Note: can move to next question or navigation buttons
        var time = timeout === undefined ? 0 : timeout;
        if (moveSelectedTimeout) {
            window.clearTimeout(moveSelectedTimeout);
        }
        moveSelectedTimeout = setTimeout(function () {
            if (IndexModule.selectedQuestion === null) return;
            var nextQuestion = GeneralQuestion.getNextQuestion(IndexModule.questions, IndexModule.selectedQuestion.id);
            var nextQuestionId = nextQuestion !== null ? nextQuestion.id : undefined;
            moveQuestion(IndexModule.selectedQuestion.id, nextQuestionId);
            moveSelectedTimeout = null;
        }, time);
    }

    function moveQuestion(orginalQuestionId, destinationQuestionId) {
        // Just move from question to question or question to navigation
        if (orginalQuestionId < destinationQuestionId) {
            GeneralQuestionValidation.validate(IndexModule.selectedQuestion);
            if (IndexModule.selectedQuestion.errors && IndexModule.selectedQuestion.errors.length > 0) {
                GeneralQuestion.replaceQuestionErrorMessage(IndexModule.selectedQuestion);
                IndexModule.highlightQuestion(IndexModule.selectedQuestion);
            } else {
                GeneralQuestion.clearQuestionErrorMessage(IndexModule.selectedQuestion);
                moveToAnotherQuestion();
            }
        } else {
            if (destinationQuestionId === undefined) {
                moveToNavigation();
            } else {
                moveToAnotherQuestion();
            }
        }
        return;

        function moveToAnotherQuestion() {
            if (orginalQuestionId !== undefined) GeneralQuestionMobile.deactiveQuestion(orginalQuestionId);
            var nextWorkingQuestion = GeneralQuestion.getQuestionById(destinationQuestionId);
            IndexModule.highlightQuestion(nextWorkingQuestion);
            if (nextWorkingQuestion.options) {
                var isAutoSelectOption = false;
                QuestionWithOption.setDefaultSelectedOptionId(nextWorkingQuestion, getDirection(), isAutoSelectOption);
            }
        }

        function getDirection() {
            if (orginalQuestionId === undefined) return DIRECTION.PREVIOUS;
            return destinationQuestionId < orginalQuestionId ? DIRECTION.PREVIOUS : DIRECTION.NEXT;
        }
    }

    function moveToNavigation() {
        if (IndexModule.selectedQuestion === null) return;
        GeneralQuestion.handleUpdateQuestionAnswer(IndexModule.selectedQuestion);
        GeneralQuestionMobile.deactiveQuestion(IndexModule.selectedQuestion.id);
        MobileRenderUtil.activatePage($('.next-page'));
        $(SELECTOR.page.nextNavigation).focus();
        RenderUtil.moveTop(CONST.movingElementType.navigation, $(SELECTOR.page.nextNavigation));
        IndexModule.selectedQuestion = null;
    }
})();