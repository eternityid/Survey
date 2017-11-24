var PictureQuestionNavigation = (function () {
    var KEY = GLOBAL_CONSTANTS.KEY;
    var CONST = GLOBAL_CONSTANTS.CONST;

    return {
        navigateInPictureOptions: navigateInPictureOptions
    };

    function navigateInPictureOptions(event) {
        if (KEY.UP === event.keyCode) {
            handleKeyUpOnPicture();
            return;
        }
        if (KEY.DOWN === event.keyCode) {
            handleKeyDownOnPicture();
            return;
        }
        var timeout = 0,
            isAutoSelectOption;
        if (KEY.ENTER === event.keyCode) {
            isAutoSelectOption = false;
            GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
            return;
        }

        if (KEY.LEFT === event.keyCode) {
            if (IndexModule.selectedQuestion.selectedOptionId > 1) {
                IndexModule.selectedQuestion.selectedOptionId = IndexModule.selectedQuestion.selectedOptionId - 1;
                PictureQuestionDesktop.hightlightPictureOption(IndexModule.selectedQuestion);
            } else {
                isAutoSelectOption = true;
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionUp(isAutoSelectOption);
            }
            return;
        }
        if (KEY.RIGHT === event.keyCode) {
            if (IndexModule.selectedQuestion.selectedOptionId < IndexModule.selectedQuestion.options.length) {
                IndexModule.selectedQuestion.selectedOptionId = IndexModule.selectedQuestion.selectedOptionId + 1;
                PictureQuestionDesktop.hightlightPictureOption(IndexModule.selectedQuestion);
            } else {
                isAutoSelectOption = true;
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
            }
        }
    }

    function handleKeyUpOnPicture() {
        var maximumPictureNumberPerRow = PictureQuestionDesktop.countMaximumPictureNumberPerRow(IndexModule.selectedQuestion);

        if (IndexModule.selectedQuestion.selectedOptionId <= maximumPictureNumberPerRow) {
            var isAutoSelectOption = true;
            GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionUp(isAutoSelectOption);
        } else {
            IndexModule.selectedQuestion.selectedOptionId = IndexModule.selectedQuestion.selectedOptionId - maximumPictureNumberPerRow;
            PictureQuestionDesktop.hightlightPictureOption(IndexModule.selectedQuestion);
        }
    }

    function handleKeyDownOnPicture() {
        var maximumPictureNumberPerRow = PictureQuestionDesktop.countMaximumPictureNumberPerRow(IndexModule.selectedQuestion),
            numberPictures = IndexModule.selectedQuestion.options.length;

        if (IndexModule.selectedQuestion.selectedOptionId + maximumPictureNumberPerRow > numberPictures) {
            var numberPictureOnLastRow = numberPictures % maximumPictureNumberPerRow;
            if (numberPictureOnLastRow === 0) numberPictureOnLastRow = maximumPictureNumberPerRow;

            var optionIdOfLastPictureOnPreviousRow = numberPictures - numberPictureOnLastRow;
            if (IndexModule.selectedQuestion.selectedOptionId > optionIdOfLastPictureOnPreviousRow) {
                var timeout = 0,
                    isAutoSelectOption = true;
                GeneralQuestionNavigationDesktop.handleMoveSelectedQuestionDown(timeout, isAutoSelectOption);
            } else {
                IndexModule.selectedQuestion.selectedOptionId = numberPictures;
                PictureQuestionDesktop.hightlightPictureOption(IndexModule.selectedQuestion);
            }
        } else {
            IndexModule.selectedQuestion.selectedOptionId = IndexModule.selectedQuestion.selectedOptionId + maximumPictureNumberPerRow;
            PictureQuestionDesktop.hightlightPictureOption(IndexModule.selectedQuestion);
        }
    }
})();