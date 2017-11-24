var PictureQuestionMobile = (function () {
    var SELECTOR = GLOBAL_CONSTANTS.SELECTOR;

    return {
        handleSelectedPictureOption: handleSelectedPictureOption
    };

    function handleSelectedPictureOption(selectedQuestion) {
        if (SELECTOR.question.type.pictureSingleSelection === selectedQuestion.type) {
            var questionAlias = selectedQuestion.options[0].optionElement.name;

            $('.options_' + questionAlias).each(function () {
                $(this).find('.thumbnail').removeClass('selected');
                $(this).find('.tick').removeClass('glyphicon-record').addClass('icon-single-selection-unchecked');
            });

            var optionChecked = $('#' + questionAlias + "_" + selectedQuestion.selectedOptionId);
            optionChecked.prop('checked', true);

            var option = $('#option_' + questionAlias + '_' + selectedQuestion.selectedOptionId);
            if (optionChecked.prop('checked')) {
                option.find('.thumbnail').addClass('selected');
                option.find('.tick').removeClass('icon-single-selection-unchecked').addClass('glyphicon-record');
            }
        } else if (SELECTOR.question.type.pictureMultipleSelection === selectedQuestion.type) {
            var optionIndex = selectedQuestion.selectedOptionId - 1;
            var checkbox = $('#' + selectedQuestion.options[optionIndex].optionElement.id);
            var checked = checkbox.prop('checked');

            var optionSection = $(checkbox[0].parentNode);
            optionSection.addClass('selected');
            if (checked) {
                optionSection.find('.tick').removeClass('glyphicon-unchecked').addClass('glyphicon-check');
            }
            else {
                optionSection.find('.tick').removeClass('glyphicon-check').addClass('glyphicon-unchecked');
            }
        }
    }
})();