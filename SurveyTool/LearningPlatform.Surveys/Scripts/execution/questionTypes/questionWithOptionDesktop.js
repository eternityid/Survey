var QuestionWithOptionDesktop = (function () {
    var CSS = GLOBAL_CONSTANTS.CSS;
    var QUESTION_TYPES = GLOBAL_CONSTANTS.QUESTION_TYPES;

    return {
        deactiveOptions: deactiveOptions,
        setActiveClassForOption: setActiveClassForOption
    };

    function deactiveOptions(question) {
        if (!question.options || question.options.length < 1) return;

        for (var i = 0; i < question.options.length; i++) {
            setDeactiveClassForOption(question, question.options[i]);
        }
    }

    function setDeactiveClassForOption(question, option) {
        var parentDeactiveNode;
        switch (question.questionType) {
            case QUESTION_TYPES.singleSelectionGrid:
                parentDeactiveNode = option.optionElement.closest('td');
                break;
            case QUESTION_TYPES.multipleSelectionGrid:
                parentDeactiveNode = option.optionElement.closest('td');
                break;
            case QUESTION_TYPES.scaleGrid:
                if (question.settings.isRenderOptionByButton) break;
                parentDeactiveNode = option.optionElement.closest('td');
                break;
            default:
                //TODO separate when seeing specific cases
                parentDeactiveNode = option.optionElement.parentNode;
                break;
        }
        if (!parentDeactiveNode) return;
        $(parentDeactiveNode).removeClass(CSS.option.active).addClass(CSS.option.deactive);
    }

    function setActiveClassForOption(question, option) {
        var parentActiveNode;
        switch (question.questionType) {
            case QUESTION_TYPES.singleSelectionGrid:
                parentActiveNode = option.optionElement.closest('td');
                break;
            case QUESTION_TYPES.multipleSelectionGrid:
                parentActiveNode = option.optionElement.closest('td');
                break;
            case QUESTION_TYPES.scaleGrid:
                if (question.settings.isRenderOptionByButton) break;
                parentActiveNode = option.optionElement.closest('td');
                break;
            default:
                //TODO separate when seeing specific cases
                parentActiveNode = option.optionElement.parentNode;
                break;
        }
        if (!parentActiveNode) return;
        $(parentActiveNode).removeClass(CSS.option.deactive).addClass(CSS.option.active);
    }
})();