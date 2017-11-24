var RatingQuestionNavigation = (function () {
    var KEY = GLOBAL_CONSTANTS.KEY;

    return {
        navigateRatingQuestionType: navigateRatingQuestionType,
        navigateRatingGridQuestionType: navigateRatingGridQuestionType
    };

    function navigateRatingQuestionType(event) {
        var ratingValue = $(IndexModule.selectedQuestion.options[0].optionElement).val();
        var timeout = 0,
            isAutoSelectOption;

        if (ArrayUtil.hasValueIn([KEY.UP], event.keyCode)) {
            isAutoSelectOption = true;
            GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionUp(isAutoSelectOption);
        } else if (ArrayUtil.hasValueIn([KEY.DOWN], event.keyCode)) {
            isAutoSelectOption = true;
            GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
        } else if (ArrayUtil.hasValueIn([KEY.ENTER], event.keyCode)) {
            isAutoSelectOption = false;
            GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
        } else if (ArrayUtil.hasValueIn([KEY.LEFT], event.keyCode)) {
            if (parseInt(ratingValue) === 0) {
                isAutoSelectOption = true;
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionUp(isAutoSelectOption);
            } else {
                GeneralQuestionValidation.handleCheckingValidate(IndexModule.selectedQuestion);
                $(IndexModule.selectedQuestion.options[0].optionElement).rating('rate', --ratingValue);
                if (!GeneralQuestionValidation.isQuestionAnswered(IndexModule.selectedQuestion)) {
                    $('.ok-button').removeClass('show');
                } else {
                    GeneralQuestion.activateOKButton(IndexModule.selectedQuestion);
                }
            }
        } else if (ArrayUtil.hasValueIn([KEY.RIGHT], event.keyCode)) {
            var numberStars = $(IndexModule.selectedQuestion.options[0].optionElement).data('stop');

            if (parseInt(ratingValue) === numberStars) {
                GeneralQuestionValidation.handleCheckingValidate(IndexModule.selectedQuestion);
                var delay,
                    isAutoSelectOption = true;
                GeneralPageDesktop.handleAutoNextOrNextQuestion(delay, isAutoSelectOption);
            } else {
                $(IndexModule.selectedQuestion.options[0].optionElement).rating('rate', ++ratingValue);
                GeneralQuestionValidation.handleCheckingValidate(IndexModule.selectedQuestion);
                if (!GeneralQuestionValidation.isQuestionAnswered(IndexModule.selectedQuestion)) {
                    $('.ok-button').removeClass('show');
                } else {
                    GeneralQuestion.activateOKButton(IndexModule.selectedQuestion);
                }
            }
        }
    }

    function navigateRatingGridQuestionType(event) {
        var ratingValueOfSelectedOption = getRatingValueOfSelectedOption();
        var numberStars = $(IndexModule.selectedQuestion.options[0].optionElement).data('stop');

        var timeout = 0,
            isAutoSelectOption;
        switch (event.keyCode) {
            case KEY.UP:
                isAutoSelectOption = true;
                moveSelectedRatingOptionUp();
                break;
            case KEY.DOWN:
                isAutoSelectOption = true;
                moveSelectedRatingOptionDown();
                break;
            case KEY.ENTER:
                isAutoSelectOption = false;
                moveSelectedRatingOptionDown();
                break;
            case KEY.LEFT:
                if (ratingValueOfSelectedOption < 1) {
                    isAutoSelectOption = true;
                    moveSelectedRatingOptionUp();
                } else {
                    $(IndexModule.selectedQuestion.options[IndexModule.selectedQuestion.selectedOptionId - 1].optionElement).rating('rate', --ratingValueOfSelectedOption);
                    GeneralQuestionValidation.handleCheckingValidate(IndexModule.selectedQuestion);
                    if (!GeneralQuestionValidation.isQuestionAnswered(IndexModule.selectedQuestion)) {
                        $('.ok-button').removeClass('show');
                    } else {
                        GeneralQuestion.activateOKButton(IndexModule.selectedQuestion);
                    }
                }
                break;
            case KEY.RIGHT:
                if (ratingValueOfSelectedOption === numberStars) {
                    isAutoSelectOption = true;
                    moveSelectedRatingOptionDown();
                } else {
                    $(IndexModule.selectedQuestion.options[IndexModule.selectedQuestion.selectedOptionId - 1].optionElement).rating('rate', ++ratingValueOfSelectedOption);
                    GeneralQuestionValidation.handleCheckingValidate(IndexModule.selectedQuestion);
                    if (!GeneralQuestionValidation.isQuestionAnswered(IndexModule.selectedQuestion)) {
                        $('.ok-button').removeClass('show');
                    } else {
                        GeneralQuestion.activateOKButton(IndexModule.selectedQuestion);
                    }
                }
                break;
        }
        return;

        function getRatingValueOfSelectedOption() {
            var selectedOption = IndexModule.selectedQuestion.options[IndexModule.selectedQuestion.selectedOptionId - 1];
            return parseInt('0' + $(selectedOption.optionElement).val());
        }

        function moveSelectedRatingOptionUp() {
            if (IndexModule.selectedQuestion.selectedOptionId < 2) {
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionUp(isAutoSelectOption);
            } else {
                IndexModule.selectedQuestion.selectedOptionId--;
                IndexModule.highlightOption(IndexModule.selectedQuestion);
            }
        }

        function moveSelectedRatingOptionDown() {
            if (IndexModule.selectedQuestion.selectedOptionId === IndexModule.selectedQuestion.options.length) {
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
            } else {
                IndexModule.selectedQuestion.selectedOptionId++;
                IndexModule.highlightOption(IndexModule.selectedQuestion);
            }
        }
    }
})();