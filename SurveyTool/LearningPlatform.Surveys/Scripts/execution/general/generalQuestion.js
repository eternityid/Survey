var GeneralQuestion = (function () {
    var CONST = GLOBAL_CONSTANTS.CONST;
    var SELECTOR = GLOBAL_CONSTANTS.SELECTOR;
    var CSS = GLOBAL_CONSTANTS.CSS;

    return {
        focusAnswer: focusAnswer,
        getQuestionElementFromChild: getQuestionElementFromChild,
        createQuestion: createQuestion,
        createOption: createOption,
        setupQuestionSettings: setupQuestionSettings,
        isSelectOtherTextOption: isSelectOtherTextOption,
        activateOKButton: activateOKButton,
        getPreviousQuestion: getPreviousQuestion,
        getNextQuestion: getNextQuestion,
        getQuestionById: getQuestionById,
        getLastQuestion: getLastQuestion,
        isFirstQuestion: isFirstQuestion,
        isLastQuestion: isLastQuestion,
        getQuestionAnswer: getQuestionAnswer,
        setActiveClassForQuestionSettings: setActiveClassForQuestionSettings,
        setDeactiveClassForQuestionSettings: setDeactiveClassForQuestionSettings,
        replaceQuestionErrorMessage: replaceQuestionErrorMessage,
        clearQuestionErrorMessage: clearQuestionErrorMessage,
        isErrorMessageEmpty: isErrorMessageEmpty,
        updateQuestionAnswer: updateQuestionAnswer,
        handleUpdateQuestionAnswer: handleUpdateQuestionAnswer,
        addOKButton: addOKButton
    };

    function focusAnswer(question) {
        //TODO should move this function into generalQuestionDesktop.js file
        if (RenderUtil.isApplyOneQuestionPerPage()) return;

        //Note: just focus on numeric, textbox, textare, combobox in question
        var isTextAnswer = ArrayUtil.hasValueIn(QuestionType.getQuestionTypeSelectors(CONST.optionType.text), question.type);
        if (isTextAnswer) {
            var textSelector = question.type + ' ' + (question.type === SELECTOR.question.type.longText ? CONST.elementType.textarea : CONST.elementType.input);
            question.questionElement.find(textSelector).focus();
        } else if (SELECTOR.question.type.singleSelectionDropdown === question.type) {
            question.questionElement.find(question.type + ' ' + CONST.elementType.select).focus();
        } else if (SELECTOR.question.type.gridSelection === question.type) {
            if (question.options.length === 0) return;
            var inputType = question.options[0].optionElement.type;
            if (inputType === 'text') {
                question.questionElement.find(SELECTOR.option.active + '[type=text]').focus();
                // TextListQuestion.createTabButtonAreaForInputs(question);
            } else if (inputType === 'textarea') {
                question.questionElement.find('td.long-text.active-option textarea').focus();
                // TextListQuestion.createTabButtonAreaForInputs(question);
            }
        }
    }

    function getQuestionElementFromChild(childElement) {
        return $(childElement).closest('.question-settings').find(SELECTOR.question.questionElement);
    }

    function createQuestion(idx, type, questionElement) {
        var numberOfQuestion = $(SELECTOR.question.questionElement).length;
        var isLastPage = $('input[type=submit][value=Finish]').length > 0;

        return {
            id: idx,
            alias: questionElement.parent().attr('question-alias'),
            type: type,
            questionElement: questionElement,
            settings: {},
            isLastQuestionInSurvey: idx === numberOfQuestion && isLastPage,
            errors: [],
            questionType: undefined,
            title: StringUtil.getPlainText(questionElement.find('div.question-title p').text()),
            validations: []
        };
    }

    function createOption(id, optionElement) {
        return {
            id: id,
            optionElement: optionElement
        };
    }

    function setupQuestionSettings(question) {
        var settings = {};
        var className = "";

        var questionSettingElement = $(question.questionElement.closest('.question-settings'));
        settings.isRequired = questionSettingElement.attr('isRequired').toLowerCase() === "true";

        if (ArrayUtil.hasValueIn([SELECTOR.question.type.singleSelection, SELECTOR.question.type.multiSelection], question.type)) {
            className = question.questionElement.find(SELECTOR.question.type.singleSelection + ', ' + SELECTOR.question.type.multiSelection).parent().attr('class');
        }
        settings.direction = className === 'horizontal' ? 1 : 0;

        settings.isRenderOptionByButton = $(question.questionElement).find('div.render-button').length > 0;

        return settings;
    }

    function isSelectOtherTextOption(question) {
        if (!question.hasOwnProperty('selectedOptionId')) return false;

        var selectedOption = question.options[question.selectedOptionId - 1];
        if (!selectedOption || !selectedOption.optionElement) return false;
        var parentNode = selectedOption.optionElement.parentNode.parentNode.parentNode;
        return $(parentNode).hasClass('single-selection-other');
    }

    function activateOKButton(question) {
        $('.ok-button').removeClass('show');
        question.questionElement.parent().find('.ok-button').addClass('show');
    }

    function getPreviousQuestion(questions, id) {
        var index = getQuestionIndex(questions, id);
        return index > 0 ?
            questions[index - 1] :
            null;
    }

    function getQuestionIndex(questions, id) {
        return questions.findIndex(function (question) {
            return question.id === id;
        });
    }

    function getNextQuestion(questions, id) {
        var index = getQuestionIndex(questions, id);
        return index < questions.length - 1 ?
            questions[index + 1] :
            null;
    }

    function getQuestionById(questionId) {
        return IndexModule.questions[questionId - 1];
    }

    function getLastQuestion() {
        return IndexModule.questions[IndexModule.questions.length - 1];
    }

    function isFirstQuestion(questionId) {
        return IndexModule.questions.length > 0 &&
            IndexModule.questions[0].id === questionId;
    }

    function isLastQuestion(questionId) {
        return IndexModule.questions.length > 0 &&
            IndexModule.questions[IndexModule.questions.length - 1].id === questionId;
    }

    function getQuestionAnswer(question) {
        var rawFormValues = $('form').serializeArray().filter(function (formValue) {
            return formValue.name.indexOf('$') !== 0;
        });

        var questionsAnswerValue = [];

        $.each(rawFormValues, function (ind, rawFormValue) {
            var isNameExisting = questionsAnswerValue.some(function (answer) {
                return answer.name === rawFormValue.name;
            });

            var aliasFromFormValue = $('[name=' + rawFormValue.name + ']').closest('.question-settings').attr('question-alias');
            if (aliasFromFormValue !== question.alias || isNameExisting) return;
            //Ignore other text
            if (rawFormValue.name.indexOf('OtherQuestion-') === 0) {
                var textboxes = $('form').find('[name="' + rawFormValue.name + '"]');
                if (textboxes.length === 1 && textboxes[0].type === 'text') return;
            }
            questionsAnswerValue.push({
                alias: question.alias,
                name: rawFormValue.name,
                value: rawFormValue.value
            });
        });
        return questionsAnswerValue;
    }

    function setActiveClassForQuestionSettings(question) {
        $(question.questionElement).closest('.question-settings')
            .removeClass(CSS.question.active + ' ' + CSS.question.deactive)
            .addClass(CSS.question.active);
    }

    function setDeactiveClassForQuestionSettings(question) {
        $(question.questionElement).closest('.question-settings')
            .removeClass(CSS.question.active + ' ' + CSS.question.deactive)
            .addClass(CSS.question.deactive);
    }

    function replaceQuestionErrorMessage(question) {
        var errorQuestionElementContainer = $(question.questionElement).prev();
        var errorQuestionElementContainerHtml = errorQuestionElementContainer.html();
        var errorQuestionElement = errorQuestionElementContainer.find('.alert');
        var errorElementItems = [];

        for (var i = 0; i < question.errors.length; i++) {
            errorElementItems.push('<p><label>' + question.errors[i].message + '</label></p>');
        }

        if (errorQuestionElement.length > 0) {
            errorQuestionElement.html(errorElementItems.join(''));
        } else {
            errorQuestionElementContainer.html(['<div class="alert alert-info" role="alert">', errorElementItems.join(''), '</div>'].join(''));
        }
    }

    function clearQuestionErrorMessage(question) {
        var errorQuestionElementContainer = $(question.questionElement).prev();
        errorQuestionElementContainer.html('');

        var allErrorElements = $('.container .question-settings .alert');
        if (allErrorElements.length > 0) return;
        $('.container form > .alert:not([id="clientError"])').remove();
    }

    function isErrorMessageEmpty(question) {
        return question.questionElement.parents('.question-settings').find('.alert-info').length < 1;
    }

    function updateQuestionAnswer(answerRecord) {
        var url = window.location.origin + window.location.pathname + '/incomming-page/answers';

        $.ajax({
            type: "PUT",
            url: url,
            data: answerRecord.formData,
            beforeSend: function () {
                window.isCallingAjaxUpdateAnswer = true;
            }
        }).done(function () {
            window.isCallingAjaxUpdateAnswer = false;

            if (window.formAnswerRecordStack.length) {
                var latestAnswerRecordInStack = window.formAnswerRecordStack.pop();
                window.formAnswerRecordStack = [];
                updateQuestionAnswer(latestAnswerRecordInStack);
            }
        });
    }

    function handleUpdateQuestionAnswer(previousQuestion) {
        // To send answer, checking: question is exist and form was changed
        // TODO: side effects
        if (previousQuestion !== null && !previousQuestion.errors.length &&
            $('form').serialize() !== sessionStorage.form) {

            insertFormAnswerRecordToStack(previousQuestion.alias);
            if (!window.isCallingAjaxUpdateAnswer && window.formAnswerRecordStack.length) {
                var latestAnswerRecordInStack = window.formAnswerRecordStack.pop();
                GeneralQuestion.updateQuestionAnswer(latestAnswerRecordInStack);
                sessionStorage.form = $('form').serialize();
            }
        }

        function insertFormAnswerRecordToStack(questionAlias) {
            window.formAnswerRecordStack.push({
                formData: $('form').serialize(),
                questionAlias: questionAlias
            });
        }
    }

    function addOKButton(question) {
        if (!RenderUtil.isNeedRenderQuestionUI()) return;
        var okButton = '<div class="ok-button"><button type="button" class="btn btn-primary"><span class="glyphicon glyphicon-ok"></span>OK</button><span class="ok-button-text">or press TAB to go next</span></div>';
        question.questionElement.append(okButton);
    }
})();
