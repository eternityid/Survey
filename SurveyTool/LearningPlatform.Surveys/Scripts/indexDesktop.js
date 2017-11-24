var IndexModule = (function () {
    var DIRECTION = GLOBAL_CONSTANTS.DIRECTION;
    var CSS = GLOBAL_CONSTANTS.CSS;
    var SELECTOR = GLOBAL_CONSTANTS.SELECTOR;
    var CONST = GLOBAL_CONSTANTS.CONST;
    var QUESTION_TYPES = GLOBAL_CONSTANTS.QUESTION_TYPES;
    var KEY = GLOBAL_CONSTANTS.KEY;

    var me = {};
    me.selectedQuestion = null;
    me.scrollDirection = {};
    me.questions = [];
    me.currentProgressBarWidth = ($('.progress-bar').length > 0 && Number($('.progress-bar')[0].style.width.replace('%', ''))) || 0;

    function init() {
        reRenderQuestionsUI();

        if (isPreviewMode || onlyPreviewContent) {
            // TODO just temporary fix, need to be refactored after restructure
            $('.question-settings:first').removeClass(CSS.question.active + ' ' + CSS.question.deactive).addClass(CSS.question.active);
            $('.question-settings:not(:first)').removeClass(CSS.question.active + ' ' + CSS.question.deactive).addClass(CSS.question.deactive);
            $('.date input').pickmeup_twitter_bootstrap();

            return;
        }

        me.questions = setupQuestions();

        setupFormValidation();
        setupEvents();
        DateQuestionDesktop.buildDateQuestion();
        onDocumentReady();
        return;

        function setupQuestions() {
            me.questions = [];
            var index = 0,
                haveLikertOptionRenderAsButton = false;

            $(SELECTOR.question.questionElement).each(function () {
                index += 1;

                var questionElement = $(this);
                var type = QuestionType.getQuestionType(questionElement);

                var question = GeneralQuestion.createQuestion(index, type, questionElement),
                    elementKeysInOption = 'input[type=radio], input[type=checkbox], td.short-text input[type=text], div.other-text input[type=text], table.grid-selection td.long-text textarea, .ratings';
                question.questionElement.on('click', elementKeysInOption, { question: question }, onOptionClick);
                question.questionElement.on('click', { question: [index] }, onQuestionClick.bind(question));
                GeneralQuestion.setDeactiveClassForQuestionSettings(question);

                question.settings = GeneralQuestion.setupQuestionSettings(question);
                question.options = setupOptions(question, SELECTOR.option.types.join(', '));
                if (question.options.length) {
                    question.beforeStartIndex = 0;
                    question.startIndex = 1;
                    question.endIndex = question.options.length;
                    question.selectedOptionId = question.beforeStartIndex;
                } else {
                    delete question.options;
                }
                question.questionElement.data(CONST.questionDataKey, question);

                setupEventsForSingleSelectionAsDropdown(question);
                setupEventsForSingleSelectionAsDropdownWithFilter(question);

                var globalQuestion = GlobalQuestions.getQuestionByAlias(question.alias);
                if (globalQuestion) {
                    question.errors = globalQuestion.errors;
                    question.title = StringUtil.getPlainText(globalQuestion.alias);
                    question.questionType = globalQuestion.questionType;
                    question.validations = globalQuestion.validators;
                }

                var isRatingOrRatingGridQuestion = question.questionType === QUESTION_TYPES.rating || question.questionType === QUESTION_TYPES.ratingGrid;
                if (isRatingOrRatingGridQuestion) {
                    QuestionWithRatingOption.addInactiveRatingsClassToQuestion(questionElement);
                }

                me.questions.push(question);

                if (SELECTOR.question.type.likerScale === question.type || QuestionType.isLikertGridQuestion(question)) {
                    if (question.settings.isRenderOptionByButton) haveLikertOptionRenderAsButton = true;
                }

                if (!QuestionType.isSingleAnswerQuestion(question)) {
                    if (question.isLastQuestionInSurvey || GeneralPage.isThankYouPage()) return;
                    GeneralQuestion.addOKButton(question);
                }
            });


            if (haveLikertOptionRenderAsButton) {
                $(SELECTOR.question.likerHeading).on('click', function (event) {
                    var likerLabel = $(event.currentTarget).find('label');
                    if (likerLabel.length === 1 && likerLabel.attr('for') !== undefined) {
                        $('#' + likerLabel.attr('for')).click();
                    }
                });
            }

            return me.questions;

            function setupOptions(question, optionSelector) {
                var list = [];
                var options = question.questionElement.find(optionSelector);
                if (options && options.length > 0) {
                    var option;
                    for (var i = 0; i < options.length; i++) {
                        option = GeneralQuestion.createOption(i + 1, options[i]);
                        var optionElement;

                        if (ArrayUtil.hasValueIn([SELECTOR.question.type.singleSelection, SELECTOR.question.type.multiSelection, SELECTOR.question.type.likerScale], question.type)) {
                            $(option.optionElement).attr('title', i + 1);
                            $(option.optionElement).attr('position', i + 1);
                        } else if (ArrayUtil.hasValueIn([SELECTOR.question.type.pictureSingleSelection], question.type)) {
                            if (option.optionElement.checked) {
                                optionElement = $('#option_' + option.optionElement.name + '_' + option.id);
                                optionElement.find('.thumbail').removeClass('picture-option-active').addClass('picture-option-active');
                                optionElement.find('.tick').removeClass('icon-single-selection-unchecked').addClass('glyphicon-record');
                            }
                            $(option.optionElement).attr('position', i + 1);
                        } else if (ArrayUtil.hasValueIn([SELECTOR.question.type.pictureMultipleSelection], question.type)) {
                            if (option.optionElement.checked) {
                                optionElement = $($('#' + option.optionElement.name)[0].parentNode);
                                optionElement.removeClass('picture-option-active').addClass('picture-option-active');
                                optionElement.find('.tick').removeClass('glyphicon-unchecked').addClass('glyphicon-check');
                            }
                            $(option.optionElement).attr('position', i + 1);
                        }
                        list.push(option);
                    }

                    if (ArrayUtil.hasValueIn([SELECTOR.question.type.pictureSingleSelection], question.type)) {
                        option = $(question.questionElement).find('.thumbnail');
                        if (option && option.length > 0) {
                            $('.' + option.first().attr('class').split(' ')[1]).on('click', { question: question }, function (event) {
                                pictureOptionClick(event, SELECTOR.question.type.pictureSingleSelection);
                            });
                        }
                    }
                    else if (ArrayUtil.hasValueIn([SELECTOR.question.type.pictureMultipleSelection], question.type)) {
                        option = $(question.questionElement).find('.thumbnail');
                        if (option && option.length > 0) {
                            $('.' + option.first().attr('class').split(' ')[1]).on('click', { question: question }, function (event) {
                                pictureOptionClick(event, SELECTOR.question.type.pictureMultipleSelection);
                            });
                        }
                    }
                }
                return list;

                function pictureOptionClick(event, type) {
                    var question = event.data.question;
                    if (!isQuestionHighlighted(question)) return;
                    if (ArrayUtil.hasValueIn([SELECTOR.question.type.pictureSingleSelection, SELECTOR.question.type.pictureMultipleSelection], type)) {
                        if (!isQuestionHighlighted(question)) {
                            if (me.selectedQuestion) GeneralQuestionDesktop.deactiveQuestion(me.selectedQuestion.id);
                            highlightQuestion(question);
                        }

                        if (SELECTOR.question.type.pictureSingleSelection === type) {
                            me.selectedQuestion.selectedOptionId = parseInt($(event.currentTarget).find('input[type=radio]').attr("position"));
                        } else if (SELECTOR.question.type.pictureMultipleSelection === type) {
                            me.selectedQuestion.selectedOptionId = parseInt($(event.currentTarget).find('input[type=checkbox]').attr("position"));
                            var checkbox = ($(event.currentTarget).find('input[type=checkbox]'));
                            checkbox.prop('checked', !checkbox.prop('checked'));
                        }
                        PictureQuestionDesktop.handleSelectedPictureOption(me.selectedQuestion);

                        GeneralQuestionValidation.handleCheckingValidate(question);
                        if (SELECTOR.question.type.pictureSingleSelection === type) {
                            var delay,
                                isAutoSelectOption = false;
                            GeneralPageDesktop.handleAutoNextOrNextQuestion(delay, isAutoSelectOption);
                            EventUtil.stopEvent(event);
                        } else {
                            $(event.currentTarget).toggleClass('selected', checkbox.prop('checked'));
                            if (!GeneralQuestionValidation.isQuestionAnswered(me.selectedQuestion)) {
                                $('.ok-button').removeClass('show');
                            } else {
                                GeneralQuestion.activateOKButton(me.selectedQuestion);
                            }
                        }
                    }
                }
            }

            function onQuestionClick(event) {
                var question = this;
                if (me.selectedQuestion === null) {
                    prepareToWorkOnQuestionByClicking();
                } else {
                    if (me.selectedQuestion.id === question.id) return;
                    GeneralQuestionDesktop.deactiveQuestion(me.selectedQuestion.id);
                    var isRatingOrRatingGridQuestion = me.selectedQuestion.questionType === QUESTION_TYPES.rating || me.selectedQuestion.questionType === QUESTION_TYPES.ratingGrid;
                    if (isRatingOrRatingGridQuestion) {
                        QuestionWithRatingOption.addInactiveRatingsClassToQuestion(me.selectedQuestion.questionElement);
                    }
                    prepareToWorkOnQuestionByClicking();
                }
                EventUtil.stopEvent(event);
                return;

                function prepareToWorkOnQuestionByClicking() {
                    highlightQuestion(question);
                    if (question.options) {
                        var isAutoSelectOption = false;
                        QuestionWithOption.setDefaultSelectedOptionId(question, DIRECTION.NEXT, isAutoSelectOption);
                        highlightOption(question);
                    }
                    GeneralQuestion.focusAnswer(question);
                }
            }

            function onOptionClick(event) {
                var question = event.data.question;
                if (!isQuestionHighlighted(question)) {
                    if (me.selectedQuestion !== null) {
                        GeneralQuestionDesktop.deactiveQuestion(me.selectedQuestion.id);
                        var isRatingOrRatingGridQuestion = me.selectedQuestion.questionType === QUESTION_TYPES.rating || me.selectedQuestion.questionType === QUESTION_TYPES.ratingGrid;
                        if (isRatingOrRatingGridQuestion) {
                            QuestionWithRatingOption.addInactiveRatingsClassToQuestion(me.selectedQuestion.questionElement);
                        }
                    }
                    highlightQuestion(question);

                    if (question.type === SELECTOR.question.type.ratings) {
                        event.stopPropagation();
                        return;
                    }
                }
                if (event.target.type === CONST.elementType.text && question.type !== SELECTOR.question.type.gridSelection) {
                    var workingOption = QuestionWithOption.getOptionByOtherOption(event, question);
                    if (workingOption) {
                        workingOption.checked = true;
                        question.selectedOptionId = parseInt($(workingOption).attr("position"));
                        highlightOption(question);
                    }
                } else if (event.target.className.split(' ').indexOf('glyphicon') >= 0 && question.type === SELECTOR.question.type.gridSelection) {
                    var selectedRatingOptionId = QuestionWithOption.getSelectedRatingOptionId(event);
                    if (selectedRatingOptionId < 1) {
                        console.log('Cannot get selected rating option for rating grid');
                    } else {
                        question.selectedOptionId = selectedRatingOptionId;
                        highlightOption(question);
                    }

                } else if (ArrayUtil.hasValueIn([CONST.elementType.radio, CONST.elementType.checkbox, CONST.elementType.text, CONST.elementType.textarea], event.target.type)) {
                    if (question.type === SELECTOR.question.type.gridSelection) {
                        if (CONST.elementType.text === event.target.type || CONST.elementType.textarea === event.target.type) {
                            question.selectedOptionId = parseInt($(this).attr("position"));
                            // TextListQuestion.createTabButtonAreaForInputs(question);
                        } else {
                            var optionPosition = GridQuestion.getOptionPositionInGridQuestion(event, question);
                            if (optionPosition < 1) {
                                console.log('Cannot get selected option for grid');
                            } else {
                                question.selectedOptionId = optionPosition;
                            }
                        }
                    } else {
                        question.selectedOptionId = parseInt($(this).attr("position"));
                        if (ArrayUtil.hasValueIn([CONST.elementType.radio, CONST.elementType.checkbox], event.target.type) &&
                            ArrayUtil.hasValueIn([SELECTOR.question.type.singleSelection, SELECTOR.question.type.multiSelection], question.type)) {
                            QuestionWithOption.focusOtherTextBySelectedOption(me.selectedQuestion);
                        }
                    }

                    //Note: Net Promoter Score and Likert/Scale support RenderAsButton mode.
                    //In this mode, button works same as radio
                    if (question.settings.isRenderOptionByButton && event.target.type === CONST.elementType.radio) {
                        event.target.checked = true;
                        QuestionWithOption.selectOptionRenderToButton(true);
                    } else {
                        highlightOption(question);
                    }
                }
                //TODO need to refactor below code segment (move to above cases)
                var isClickOnTextInput = ArrayUtil.hasValueIn(['text', 'textarea'], event.target.type);
                if (!isClickOnTextInput) {
                    GeneralQuestionValidation.handleCheckingValidate(me.selectedQuestion);
                    var isSingleAnswerQuestion = ArrayUtil.hasValueIn([QUESTION_TYPES.rating,
                        QUESTION_TYPES.scale,
                        QUESTION_TYPES.pictureSingleSelection,
                        QUESTION_TYPES.netPromoterScore
                    ], question.questionType);
                    var isQuestionAnswered = GeneralQuestionValidation.isQuestionAnswered(me.selectedQuestion);
                    var canAutoNext = isSingleAnswerQuestion && isQuestionAnswered ||
                        QUESTION_TYPES.singleSelection === question.questionType && !GeneralQuestionNavigation.isOptionHaveOther(me.selectedQuestion);

                    if (canAutoNext) {
                        GeneralQuestion.handleUpdateQuestionAnswer(me.selectedQuestion);
                        var delay,
                            isAutoSelectOption = false;
                        GeneralPageDesktop.handleAutoNextOrNextQuestion(delay, isAutoSelectOption);
                    } else {
                        if (isQuestionAnswered) {
                            GeneralQuestion.activateOKButton(me.selectedQuestion);
                        } else {
                            $('.ok-button').removeClass('show');
                        }
                    }
                }

                event.stopPropagation();
            }

            function isQuestionHighlighted(question) {
                return (me.selectedQuestion !== null && question.id === me.selectedQuestion.id);
            }

            function setupEventsForSingleSelectionAsDropdown(question) {
                if (question.type !== SELECTOR.question.type.singleSelectionDropdown) return;
                var dropdown = question.questionElement.find('select')[0];
                dropdown.addEventListener('mousedown', function (event) {
                    if (!isQuestionHighlighted(question)) {
                        event.preventDefault();
                    }
                });
                var delay,
                    isAutoSelectOption = false;
                dropdown.addEventListener('click', function (event) {
                    var isClickedToOptionsArea = event.offsetY < 0;
                    if (!isClickedToOptionsArea || !GeneralQuestionValidation.isQuestionAnswered(question)) return;
                    if (!GeneralQuestion.isErrorMessageEmpty(me.selectedQuestion)) {
                        GeneralQuestion.clearQuestionErrorMessage(me.selectedQuestion);
                    }
                    GeneralPageDesktop.handleAutoNextOrNextQuestion(delay, isAutoSelectOption);
                });
                dropdown.addEventListener('keydown', function (event) {
                    if (event.keyCode !== KEY.ENTER || !GeneralQuestionValidation.isQuestionAnswered(question)) return;
                    if (!GeneralQuestion.isErrorMessageEmpty(me.selectedQuestion)) {
                        GeneralQuestion.clearQuestionErrorMessage(me.selectedQuestion);
                    }
                    GeneralPageDesktop.handleAutoNextOrNextQuestion(delay, isAutoSelectOption);
                });
            }

            function setupEventsForSingleSelectionAsDropdownWithFilter(question) {
                $('.dropdown-with-filtering > select').on('select2:select', function () {
                    var delay,
                        isAutoSelectOption = false;
                    GeneralPageDesktop.handleAutoNextOrNextQuestion(delay, isAutoSelectOption);
                });
            }
        }

        function autoSelectFirstQuestion() {
            if (me.questions.length === 0) return;
            highlightQuestion(me.questions[0]);
            if (isPreviewMode !== true) {
                window.focus();
                GeneralQuestion.focusAnswer(me.questions[0]);
            }
        }

        function setupFormValidation() {
            $('textarea,input[type="text"]').on('change', function () {
                validateInput($(this));
            });

            $('form').on('submit', function (event) {
                var textInputElements = $('textarea,input[type="text"]');
                for (var i = 0; i < textInputElements.length; i++) {
                    if (!validateInput($(textInputElements[i]))) {
                        event.preventDefault();
                        return false;
                    }
                }
                return true;
            });

            function focusSelectQuestionAnswer(inputAnswerEl) {
                var question = GeneralQuestion.getQuestionElementFromChild(inputAnswerEl).data(CONST.questionDataKey);
                highlightQuestion(question);
                GeneralQuestion.focusAnswer(question);
                inputAnswerEl.select();
            }

            function validateInput(input) {
                var $clientErrorEl = $('#clientError');
                var $clientErrorContentEl = $clientErrorEl.find('.clientError__content');
                $clientErrorEl.hide();

                var error = false;

                var hasUniqueHtmlScriptMarkup = (new RegExp("<[/]?(" + CONST.notAllowAnswerMarkup.join("|") + ")[/]?>")).test(input.val());
                if (hasUniqueHtmlScriptMarkup) {
                    $clientErrorContentEl.html("<label>Unaccepted HTML markup and script are not allowed.</label>");
                    error = true;
                }

                if (error) {
                    focusSelectQuestionAnswer(input);
                    $clientErrorEl.show();
                } else {
                    $clientErrorEl.hide();
                }

                return !error;
            }
        }

        function setupEvents() {
            $('.ok-button button').click(function () {
                // We need to wait for the virtual keyboard to close. Otherwise, the pages will jump up and down in the next screen.
                var delayTime = 0,
                    isAutoSelectOption = false;
                GeneralPageDesktop.handleAutoNextOrNextQuestion(delayTime, isAutoSelectOption);
            });

            $('textarea, input[type=number], input[type=text]', '.question-settings').on('change keyup paste', function () {
                if ($(this).parents('.grid-selection').length > 0) return;
                if (!GeneralQuestionValidation.isQuestionAnswered(me.selectedQuestion)) {
                    $('.ok-button').removeClass('show');
                } else {
                    GeneralQuestionValidation.handleCheckingValidate(me.selectedQuestion);
                    GeneralQuestion.activateOKButton(me.selectedQuestion);
                }
            });

            $('.grid-selection', '.question-settings').each(function (ind, elem) {
                $('textarea, input[type=text]', elem).each(function (index, element) {
                    $(element).on('change keyup paste', function () {
                        if (!GeneralQuestionValidation.isQuestionAnswered(me.selectedQuestion)) {
                            $('.ok-button').removeClass('show');
                        } else {
                            if (GridQuestionValidation.isLastTopicAnswered(me.selectedQuestion)) {
                                GeneralQuestionValidation.handleCheckingValidate(me.selectedQuestion);
                                GeneralQuestion.activateOKButton(me.selectedQuestion);
                            }
                        }
                    });
                });
            });

            GeneralPageDesktop.setupNextPageEvents();
        }

        function reRenderQuestionsUI() {
            $('.question-settings').each(function (index, questionElement) {
                var isTableGridLargerThanQuestionWidth = $('table.grid-selection', questionElement).width() > $(questionElement).width();
                if (isTableGridLargerThanQuestionWidth) {
                    $('.inputArea th:first-child', questionElement).css({
                        'width': 'auto',
                        'white-space': 'normal'
                    });
                }
            });
        }

        function onDocumentReady() {
            $(document).ready(function () {
                window.formAnswerRecordStack = [];
                window.isCallingAjaxUpdateAnswer = false;
                sessionStorage.form = $('form').serialize();

                $('.grid-selection.rating-table .rating-symbol .rating-number').each(function (index, element) {
                    $(element).prependTo($(element).parent());
                });

                EventUtil.raiseEventOnNumericDom();
                $(".dropdown-with-filtering > select").select2();
                autoSelectFirstQuestion();
            });
        }
    }

    function highlightQuestion(question, delay) {
        if (question === undefined) return;
        GeneralQuestion.setActiveClassForQuestionSettings(question);
        var isRatingOrRatingGridQuestion = question.questionType === QUESTION_TYPES.rating || question.questionType === QUESTION_TYPES.ratingGrid;
        if (isRatingOrRatingGridQuestion) {
            QuestionWithRatingOption.deleteInactiveRatingsClassToQuestion(question.questionElement);
        }
        if (me.settingHotkeys != undefined && jQuery.isFunction(me.settingHotkeys)) {
            me.settingHotkeys(question);
        }

        RenderUtil.moveTop(CONST.movingElementType.question, question, delay);
        me.selectedQuestion = question;

        //TODO: side effects
        ProgressBarUtilDesktop.setProgressBarValue();
        InformationQuestion.showOkButton(me.selectedQuestion);
    }

    function highlightOption(question) {
        if (!QuestionWithOption.isValidSelectedOptionId(question)) return;
        GeneralQuestionDesktop.deactiveOptions(question);
        if (question.type === SELECTOR.question.type.pictureSingleSelection || question.type === SELECTOR.question.type.pictureMultipleSelection) {
            PictureQuestionDesktop.hightlightPictureOption(me.selectedQuestion);
            return;
        }
        if (QuestionWithOption.isValidSelectedOptionId(question) && question.type !== SELECTOR.question.type.ratings) {
            QuestionWithOptionDesktop.setActiveClassForOption(question, question.options[question.selectedOptionId - 1]);

            $('label', '.inputArea').removeClass('active-trail');
            $(question.options[question.selectedOptionId - 1].optionElement.parentNode).parent().removeClass('active-trail').addClass('active-trail');

            if (question.settings.isRenderOptionByButton) {
                if (question.type === SELECTOR.question.type.likerScale) {
                    var optionPosition = $(question.options[question.selectedOptionId - 1].optionElement).attr('position');
                    $(question.options[question.selectedOptionId - 1].optionElement).closest('.inputArea').find('.liker-heading .heading[position="' + optionPosition + '"]').addClass(CSS.option.active);
                } else if (question.type === SELECTOR.question.type.gridSelection) {
                    question.questionElement.find(SELECTOR.question.likerHeading).removeClass(CSS.option.active);
                    var radioId = question.options[question.selectedOptionId - 1].optionElement.id;
                    $(question.options[question.selectedOptionId - 1].optionElement).closest('.inputArea').find('label[for="' + radioId + '"]').parent().addClass(CSS.option.active);
                }
            }
        }
    }

    me.DIRECTION = DIRECTION;
    me.CSS = CSS;
    me.SELECTOR = SELECTOR;
    me.CONST = CONST;
    me.CLASS_NAMES = GLOBAL_CONSTANTS.CLASS_NAMES;
    me.init = init;
    me.highlightQuestion = highlightQuestion;
    me.highlightOption = highlightOption;

    return me;
})();
