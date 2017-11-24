var SingleMultipleSelectionQuestionMobile = (function () {
    var SELECTOR = GLOBAL_CONSTANTS.SELECTOR;

    return {
        setOtherTextBoxPlaceholder: setOtherTextBoxPlaceholder
    };

    function setOtherTextBoxPlaceholder(question) {
        var isSingleSelection = question.type === SELECTOR.question.type.singleSelection;
        var isMultiSelection = question.type === SELECTOR.question.type.multiSelection;
        if (!isSingleSelection && !isMultiSelection) return;

        var otherTextSelector = isSingleSelection ? '.single-selection-other' : '.multi-selection.other';
        var otherTextContainer = $(question.questionElement).find(otherTextSelector);
        if (otherTextContainer.length) {
            otherTextContainer.each(function (index, otherTextItem) {
                var otherTextbox = $('.other-text input[type="text"]', otherTextItem);
                var titleOption = $('.selection-option-title', otherTextItem);
                if (titleOption.length !== 1) return;
                var textPlaceholder = titleOption.text();

                otherTextbox.attr({
                    'placeholder': textPlaceholder,
                    'title': textPlaceholder
                });
            });
        }
    }
})();