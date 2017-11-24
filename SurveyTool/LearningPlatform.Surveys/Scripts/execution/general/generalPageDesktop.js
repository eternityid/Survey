var GeneralPageDesktop = (function () {
    var CONST = GLOBAL_CONSTANTS.CONST;
    var CSS = GLOBAL_CONSTANTS.CSS;
    var KEY = GLOBAL_CONSTANTS.KEY;

    return {
        setupNextPageEvents: setupNextPageEvents,
        handleAutoNextOrNextQuestion: handleAutoNextOrNextQuestion
    };

    function setupNextPageEvents() {
        $('.page-navigation > .next').on('click', function (event) {
            processFiredNextPage(event);
        });
        $('.page-navigation > .next').on('keyup', function (event) {
            if (ArrayUtil.hasValueIn([KEY.SPACE, KEY.ENTER], event.keyCode)) {
                processFiredNextPage(event);
            }
        });
    }

    function processFiredNextPage(event) {
        var hasQuestionError = false;

        IndexModule.questions.forEach(function (question) {
            GeneralQuestionValidation.validate(question);
            if (question.errors.length) {
                hasQuestionError = true;
                GeneralQuestion.replaceQuestionErrorMessage(question);
            } else {
                GeneralQuestion.clearQuestionErrorMessage(question);
            }
        });

        if (hasQuestionError) {
            event.target.blur();
            renderGeneralErrorMessage();
            deactiveAllQuestions();
            RenderUtil.moveTopByPosition(offsetValue = 0, CSS.question.delay);
            event.preventDefault();
            return false;
        }
    }

    function renderGeneralErrorMessage() {
        var errorContainerElements = $('.alert.alert-warning');
        var defaultErrorContainer = $('.alert.alert-warning[id=clientError]');
        var gotoFirstQuestionErrorLink = '<p><label id="move-first-invalid-question-link">Click here to go to the first error question.</label></p>';

        if (defaultErrorContainer.length && errorContainerElements.length === 1) {
            $(defaultErrorContainer).after('<div class="alert alert-warning"><label>There are errors in this page.</label>' + gotoFirstQuestionErrorLink + '</div>');
        }
        setupEventOnFirstInvalidQuestion();
        return;

        function setupEventOnFirstInvalidQuestion() {
            $('#move-first-invalid-question-link').on('click', function () {
                var errorQuestion = IndexModule.questions.find(function (question) {
                    return question.errors.length > 0;
                });
                if (errorQuestion) {
                    IndexModule.highlightQuestion(errorQuestion);
                    IndexModule.highlightOption(errorQuestion);
                    GeneralQuestion.focusAnswer(errorQuestion);
                }
            });
        }
    }

    function deactiveAllQuestions() {
        if (IndexModule.selectedQuestion) {
            GeneralQuestionDesktop.deactiveQuestion(IndexModule.selectedQuestion.id)
            IndexModule.selectedQuestion = null;
        }
        $('.question-settings').removeClass(CSS.question.active + ' ' + CSS.question.deactive).addClass(CSS.question.deactive);
    }

    function handleAutoNextOrNextQuestion(delay, isAutoSelectOption) {
        if (delay === undefined) delay = CONST.autoNextDelay;

        var nextQuestion = GeneralQuestion.getNextQuestion(IndexModule.questions, IndexModule.selectedQuestion.id);
        if (nextQuestion === null) {
            autoTriggerPageNavigationButton(0);
        } else {
            GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(delay, isAutoSelectOption);
        }
    }

    function autoTriggerPageNavigationButton(delay) {
        if ((!GeneralPage.isLastPage('.page-navigation') || !GeneralQuestion.isLastQuestion(IndexModule.selectedQuestion.id)) &&
            GeneralQuestionValidation.isAllQuestionsAnswered(IndexModule.questions)) {
            $('input.next[value=Next][type=submit]').trigger('click');
        } else {
            GeneralQuestionNavigationDesktop.moveToNavigation();
        }
    }
})();
