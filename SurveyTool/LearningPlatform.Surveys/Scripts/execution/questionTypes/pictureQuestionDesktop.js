var PictureQuestionDesktop = (function () {
    var SELECTOR = GLOBAL_CONSTANTS.SELECTOR;

    return {
        deactivePictureOptions: deactivePictureOptions,
        hightlightPictureOption: hightlightPictureOption,
        handleSelectedPictureOption: handleSelectedPictureOption,
        countMaximumPictureNumberPerRow: countMaximumPictureNumberPerRow
    };

    function deactivePictureOptions(question, selectedQuestion) {
        //TODO just keep current logic, try to use either question or selectedQuestion
        if (SELECTOR.question.type.pictureSingleSelection === question.type) {
            var questionAlias = question.options[0].optionElement.name;
            $('.options_' + questionAlias).each(function () {
                $(this).find('.thumbnail').removeClass('picture-option-active');
            });
        } else if (SELECTOR.question.type.pictureMultipleSelection === question.type) {
            $(selectedQuestion.questionElement).find('.thumbnail').each(function () {
                $(this).removeClass('picture-option-active');
            });
        }
    }

    function hightlightPictureOption(selectedQuestion) {
        deactivePictureOptions(selectedQuestion, selectedQuestion);
        var option;
        if (SELECTOR.question.type.pictureSingleSelection === selectedQuestion.type) {
            var questionAlias = selectedQuestion.options[0].optionElement.name;
            option = $('#option_' + questionAlias + '_' + selectedQuestion.selectedOptionId);
            option.find('.thumbnail').addClass('picture-option-active');
        } else if (SELECTOR.question.type.pictureMultipleSelection === selectedQuestion.type) {
            var optionIndex = selectedQuestion.selectedOptionId - 1 >= 0 ? selectedQuestion.selectedOptionId - 1 : 0;
            option = $(selectedQuestion.options[optionIndex].optionElement.parentNode);
            option.addClass('picture-option-active');
        }
    }

    function handleSelectedPictureOption(selectedQuestion) {
        if (SELECTOR.question.type.pictureSingleSelection === selectedQuestion.type) {
            var questionAlias = selectedQuestion.options[0].optionElement.name;

            $('.options_' + questionAlias).each(function () {
                $(this).find('.thumbnail').removeClass('picture-option-active');
                $(this).find('.tick').removeClass('glyphicon-record').addClass('icon-single-selection-unchecked');
            });

            var optionChecked = $('#' + questionAlias + "_" + selectedQuestion.selectedOptionId);
            optionChecked.prop('checked', true);

            var option = $('#option_' + questionAlias + '_' + selectedQuestion.selectedOptionId);
            if (optionChecked.prop('checked')) {
                option.find('.thumbnail').addClass('picture-option-active');
                option.find('.tick').removeClass('icon-single-selection-unchecked').addClass('glyphicon-record');
            }
        } else if (SELECTOR.question.type.pictureMultipleSelection === selectedQuestion.type) {
            $(selectedQuestion.questionElement).find('.thumbnail').each(function () {
                $(this).removeClass('picture-option-active');
            });
            var optionIndex = selectedQuestion.selectedOptionId - 1;
            var checkbox = $('#' + selectedQuestion.options[optionIndex].optionElement.id);
            var checked = checkbox.prop('checked');

            var optionSection = $(checkbox[0].parentNode);
            optionSection.addClass('picture-option-active');
            if (checked) {
                optionSection.find('.tick').removeClass('glyphicon-unchecked').addClass('glyphicon-check');
            }
            else {
                optionSection.find('.tick').removeClass('glyphicon-check').addClass('glyphicon-unchecked');
            }
        }
    }

    function countMaximumPictureNumberPerRow(selectedQuestion) {
        if (!ArrayUtil.hasValueIn([
            SELECTOR.question.type.pictureSingleSelection,
            SELECTOR.question.type.pictureMultipleSelection
        ], selectedQuestion.type)) return 0;
        if (selectedQuestion.options.length <= 1) return selectedQuestion.options.length;
        var firstOffsetTop = $('#' + selectedQuestion.options[0].optionElement.id).offset().top,
            maximumPictureNumber = 1;
        for (var i = 1; i < selectedQuestion.options.length; i++) {
            if ($('#' + selectedQuestion.options[i].optionElement.id).offset().top === firstOffsetTop) {
                maximumPictureNumber++;
            }
        }
        return maximumPictureNumber;
    }
})();