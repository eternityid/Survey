var GridQuestion = (function () {
    var CONST = GLOBAL_CONSTANTS.CONST;

    return {
        countOptionsInRow: countOptionsInRow,
        getSequenceOfOptionValueInLikertGrid: getSequenceOfOptionValueInLikertGrid,
        getDataStopOfRatingGridQuestion: getDataStopOfRatingGridQuestion,
        getOptionPositionInGridQuestion: getOptionPositionInGridQuestion,
        getRadiosName: getRadiosName,
        getRatingHiddensName: getRatingHiddensName,
        getCheckboxesName: getCheckboxesName,
        getTextsName: getTextsName,
        getTextareasName: getTextareasName,
        customizeRatingGridSymbolsWidth: customizeRatingGridSymbolsWidth
    };

    function countOptionsInRow(selectedQuestion, elementType, elementTargetOption) {
        var targetOption = null;
        if (ArrayUtil.hasValueIn([CONST.elementType.radio, CONST.elementType.checkbox], elementType)) {
            targetOption = elementTargetOption;
        } else if (selectedQuestion !== null && selectedQuestion.selectedOptionId > 0) {
            targetOption = selectedQuestion.options[selectedQuestion.selectedOptionId - 1].optionElement;
        }
        if (targetOption === null || targetOption === undefined) return 0;
        return $(targetOption.closest('tr')).find('input[type=' + targetOption.type + ']').length;
    }

    function getSequenceOfOptionValueInLikertGrid(question) {
        var optionValues = [];
        if (typeof question.questionElement === 'object' && question.questionElement) {
            var optionContainers = question.settings.isRenderOptionByButton ?
                question.questionElement.find('div.inputArea table tbody tr[row-index="1"] label.selection-option-title') :
                question.questionElement.find('div.inputArea table tbody tr[row-index=0] th.horizontal-header');

            for (var j = 0; j < optionContainers.length; j++) {
                optionValues.push(parseInt(optionContainers[j].innerText));
            }
        }
        return optionValues;
    }

    function getDataStopOfRatingGridQuestion(question) {
        var dataStop = 0;
        if (question.options.length > 0) {
            dataStop = parseInt($(question.options[0].optionElement).attr('data-stop'));
        }
        return dataStop;
    }

    function customizeRatingGridSymbolsWidth() {
        var smallNumberOfRatesInRow = 4;
        var largeNumberOfRatesInRow = 8;
        $('.ratings').each(function (index, element) {
            var elementChildren = $(element).find('.rating-symbol');
            var elementWidthPercentage = 100 / elementChildren.length;
            if (elementChildren.length <= smallNumberOfRatesInRow) {
                $(elementChildren).addClass('rating-symbol--large')
                    .css('width', `${elementWidthPercentage}%`);
                $(elementChildren).find('.rating-number').addClass('rating-number--large');
            }
            else if (elementChildren.length > smallNumberOfRatesInRow && elementChildren.length < largeNumberOfRatesInRow) {
                $(elementChildren).addClass('rating-symbol--medium')
                    .css('width', `${elementWidthPercentage}%`);
                $(elementChildren).find('.rating-number').addClass('rating-number--medium');
            }
            else if (elementChildren.length >= largeNumberOfRatesInRow) {
                $(elementChildren).addClass('rating-symbol--small')
                    .css('width', `${elementWidthPercentage}%`);
                $(elementChildren).find('.rating-number').addClass('rating-number--small');
            }
        });
    }

    function getOptionPositionInGridQuestion(event, question) {
        var optionPositionInQuestion = 0;
        for (var k = 0; k < question.options.length; k++) {
            if (question.options[k].optionElement.id === event.target.id) {
                optionPositionInQuestion = question.options[k].id;
                break;
            }
        }
        return optionPositionInQuestion;
    }

    function getRadiosName(question) {
        var radiosName = [];
        var radioTags = question.questionElement.find('input[type=radio]').toArray();
        radioTags.forEach(function (radioTag) {
            if (radiosName.indexOf(radioTag.name) < 0 && radioTag.name !== '') {
                radiosName.push(radioTag.name);
            }
        });
        return radiosName;
    }

    function getRatingHiddensName(question) {
        var hiddensName = [];
        var hiddenTags = question.questionElement.find('td.ratings input[type=hidden]').toArray();
        hiddenTags.forEach(function (hiddenTag) {
            if (hiddensName.indexOf(hiddenTag.name) < 0 && hiddenTag.name !== '') {
                hiddensName.push(hiddenTag.name);
            }
        });
        return hiddensName;
    }

    function getCheckboxesName(question) {
        var checkboxTags = question.questionElement.find('input[type=checkbox]').toArray();
        return checkboxTags.map(function (checkbox) {
            return checkbox.name;
        });
    }

    function getTextsName(question) {
        var textTags = question.questionElement.find('input[type=text]').toArray();
        return textTags.map(function (text) {
            return text.name;
        });
    }

    function getTextareasName(question) {
        var textareaTags = question.questionElement.find('textarea').toArray();
        return textareaTags.map(function (textarea) {
            return textarea.name;
        });
    }
})();