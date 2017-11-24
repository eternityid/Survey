var SingleMultiplePictureQuestionMobile = (function () {
    var SELECTOR = GLOBAL_CONSTANTS.SELECTOR;

    return {
        setFrameForPictureQuestionInMobile: setFrameForPictureQuestionInMobile
    };

    function setFrameForPictureQuestionInMobile(question) {
        var isSinglePictureSelection = question.type === SELECTOR.question.type.pictureSingleSelection;
        var isMultiPictureSelection = question.type === SELECTOR.question.type.pictureMultipleSelection;
        if (!isSinglePictureSelection && !isMultiPictureSelection) return;

        var pictureElement = $('.thumbnail img', question.questionElement);
        if (!$(pictureElement).parent().hasClass('picture-wrapper')) {
            $(pictureElement).wrap('<div class="picture-wrapper"></div>');
        }
    }
})();