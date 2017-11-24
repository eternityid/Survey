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

    function init() {

        if (!window.isDisableSetUpPreLoadDataTable || window.isDisableSetUpPreLoadDataTable === undefined) {
            GeneralPagePreload.setUpPreLoadDataTable();
            GeneralPagePreload.handlePreloadPages();
            window.progressBarInitValue = {};
            window.isDisableSetUpPreLoadDataTable = true;
        }

        me.questions = setupQuestions();

        QuestionPerScreen.renderQuestionUI();
        setupFormValidation();
        setupEvents();
        DateQuestionMobile.buildDateQuestion();
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
                SingleMultipleSelectionQuestionMobile.setOtherTextBoxPlaceholder(question);
                SingleMultiplePictureQuestionMobile.setFrameForPictureQuestionInMobile(question);

                var globalQuestion = GlobalQuestions.getQuestionByAlias(question.alias);
                if (globalQuestion) {
                    question.errors = globalQuestion.errors;
                    question.title = StringUtil.getPlainText(globalQuestion.alias);
                    question.questionType = globalQuestion.questionType;
                    question.validations = globalQuestion.validators;
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
                                optionElement.find('.thumbail').removeClass('selected').addClass('selected');
                                optionElement.find('.tick').removeClass('icon-single-selection-unchecked').addClass('glyphicon-record');
                            }
                            $(option.optionElement).attr('position', i + 1);
                        } else if (ArrayUtil.hasValueIn([SELECTOR.question.type.pictureMultipleSelection], question.type)) {
                            if (option.optionElement.checked) {
                                optionElement = $($('#' + option.optionElement.name)[0].parentNode);
                                optionElement.removeClass('selected').addClass('selected');
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
                            if (me.selectedQuestion) {
                                GeneralQuestionMobile.deactiveQuestion(me.selectedQuestion.id);
                            }
                            highlightQuestion(question);
                        }

                        if (SELECTOR.question.type.pictureSingleSelection === type) {
                            me.selectedQuestion.selectedOptionId = parseInt($(event.currentTarget).find('input[type=radio]').attr("position"));
                        } else if (SELECTOR.question.type.pictureMultipleSelection === type) {
                            me.selectedQuestion.selectedOptionId = parseInt($(event.currentTarget).find('input[type=checkbox]').attr("position"));
                            var checkbox = $(event.currentTarget).find('input[type=checkbox]');
                            checkbox.prop('checked', !checkbox.prop('checked'));
                        }
                        PictureQuestionMobile.handleSelectedPictureOption(me.selectedQuestion);

                        GeneralQuestionValidation.handleCheckingValidate(question);
                        if (SELECTOR.question.type.pictureSingleSelection === type) {
                            GeneralPageMobile.handleAutoNextOrNextQuestion();
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

            function onOptionClick(event) {
                var question = event.data.question;
                if (event.target.type === CONST.elementType.text && question.type !== SELECTOR.question.type.gridSelection) {
                    var workingOption = QuestionWithOption.getOptionByOtherOption(event, question);
                    if (workingOption) {
                        workingOption.checked = true;
                        question.selectedOptionId = parseInt($(workingOption).attr("position"));
                    }
                } else if (event.target.className.split(' ').indexOf('glyphicon') >= 0 && question.type === SELECTOR.question.type.gridSelection) {
                    var selectedRatingOptionId = QuestionWithOption.getSelectedRatingOptionId(event);
                    if (selectedRatingOptionId < 1) {
                        console.log('Cannot get selected rating option for rating grid');
                    } else {
                        question.selectedOptionId = selectedRatingOptionId;
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
                            QuestionWithOption.focusOtherTextBySelectedOption(IndexModule.selectedQuestion);
                        }
                    }

                    //Note: Net Promoter Score and Likert/Scale support RenderAsButton mode.
                    //In this mode, button works same as radio
                    if (question.settings.isRenderOptionByButton && event.target.type === CONST.elementType.radio) {
                        event.target.checked = true;
                        QuestionWithOption.selectOptionRenderToButton(true);
                    }
                }
                //TODO need to refactor below code segment (move to above cases)
                var isClickOnTextInput = ArrayUtil.hasValueIn(['text', 'textarea'], event.target.type);
                if (!isClickOnTextInput) {
                    GeneralQuestionValidation.handleCheckingValidate(me.selectedQuestion);
                    var isSingleAnswerQuestion = ArrayUtil.hasValueIn([
                        QUESTION_TYPES.rating,
                        QUESTION_TYPES.singleSelection,
                        QUESTION_TYPES.scale,
                        QUESTION_TYPES.pictureSingleSelection,
                        QUESTION_TYPES.netPromoterScore
                    ], question.questionType);
                    if (isSingleAnswerQuestion) {
                        if (GeneralQuestionValidation.isQuestionAnswered(me.selectedQuestion)) {
                            GeneralPageMobile.handleAutoNextOrNextQuestion();
                        }
                    } else {
                        if (!GeneralQuestionValidation.isQuestionAnswered(me.selectedQuestion)) {
                            $('.ok-button').removeClass('show');
                        } else {
                            GeneralQuestion.activateOKButton(me.selectedQuestion);
                        }
                    }
                }

                var isSingleSelection = question.type === SELECTOR.question.type.singleSelection;
                var isMultiSelection = question.type === SELECTOR.question.type.multiSelection;
                if (isSingleSelection || isMultiSelection) {
                    var hasOtherText = event.target.id.toLowerCase().indexOf('otherquestion') >= 0;
                    var selectionOption = this;
                    if (isSingleSelection) {
                        if (event.target.type === CONST.elementType.text) {
                            selectionOption = $('input[type="radio"]', $(event.target).closest('.single-selection-other'));
                        }

                        $('.single-selection, .single-selection-other', $(selectionOption).closest('.single-selection-container')).removeClass('selected');
                        $(selectionOption).closest('.single-selection').addClass('selected');
                    } else {
                        if (event.target.type === CONST.elementType.text) {
                            selectionOption = $('input[type="checkbox"]', $(event.target).closest('.multi-selection.other'));
                        }

                        $(selectionOption).closest('.multi-selection').toggleClass('selected', $(selectionOption).prop('checked'));
                    }

                    if (hasOtherText) event.preventDefault();
                }

                event.stopPropagation();
            }

            function isQuestionHighlighted(question) {
                return me.selectedQuestion !== null && question.id === me.selectedQuestion.id;
            }

            function setupEventsForSingleSelectionAsDropdown(question) {
                if (question.type !== SELECTOR.question.type.singleSelectionDropdown) return;
                var dropdown = question.questionElement.find('select')[0];
                dropdown.addEventListener('mousedown', function (event) {
                    if (!isQuestionHighlighted(question)) {
                        event.preventDefault();
                    }
                });
                dropdown.addEventListener('click', function (event) {
                    var isClickedToOptionsArea = event.offsetY < 0;
                    if (!isClickedToOptionsArea || !GeneralQuestionValidation.isQuestionAnswered(question)) return;
                    if (!GeneralQuestion.isErrorMessageEmpty(me.selectedQuestion)) {
                        GeneralQuestion.clearQuestionErrorMessage(me.selectedQuestion);
                    }
                    GeneralPageMobile.handleAutoNextOrNextQuestion();
                });
                dropdown.addEventListener('keydown', function (event) {
                    if (event.keyCode !== KEY.ENTER || !GeneralQuestionValidation.isQuestionAnswered(question)) return;
                    if (!GeneralQuestion.isErrorMessageEmpty(me.selectedQuestion)) {
                        GeneralQuestion.clearQuestionErrorMessage(me.selectedQuestion);
                    }
                    GeneralPageMobile.handleAutoNextOrNextQuestion();
                });
            }

            function setupEventsForSingleSelectionAsDropdownWithFilter(question) {
                $('.dropdown-with-filtering > select').on('select2:select', function () {
                    GeneralPageMobile.handleAutoNextOrNextQuestion();
                });
            }
        }

        function autoSelectFirstQuestion() {
            if (me.questions.length === 0) return;
            highlightQuestion(me.questions[0]);
            if (isPreviewMode !== true) {
                window.focus();
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
            $('#one-question-container').bind('touchstart touchend', MobileRenderUtil.detectScrollDown);
            $('#one-question-container').bind('touchstart touchend', windowScrollEvent);
            $('.ok-button button').click(function () {
                // We need to wait for the virtual keyboard to close. Otherwise, the pages will jump up and down in the next screen.
                var answerAnimationDelay = 200;
                GeneralPageMobile.handleAutoNextOrNextQuestion(answerAnimationDelay);
            });

            $('textarea, input[type=number], input[type=text]', '.question-settings').on('change keyup paste', function () {
                if ($(this).parents('.grid-selection').length > 0) return;
                if (!GeneralQuestionValidation.isQuestionAnswered(me.selectedQuestion)) {
                    $('.ok-button').removeClass('show');
                } else {
                    GeneralQuestionValidation.handleCheckingValidateForAnsweringQuestion(me.selectedQuestion);
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
                                GeneralQuestionValidation.handleCheckingValidateForAnsweringQuestion(me.selectedQuestion);
                                GeneralQuestion.activateOKButton(me.selectedQuestion);
                            }
                        }
                    });
                });
            });
        }

        function onDocumentReady() {
            $(document).ready(function () {
                window.formAnswerRecordStack = [];
                window.isCallingAjaxUpdateAnswer = false;
                sessionStorage.form = $('form').serialize();

                QuestionPerScreen.showOneQuestionPerPage();
                QuestionPerScreen.handleToggleVirtualKeyboard();
                QuestionPerScreen.handleWindowResize();
                QuestionPerScreen.blurElementWhenScrolling();
                GridQuestion.customizeRatingGridSymbolsWidth();
                EventUtil.raiseEventOnNumericDom();
                ProgressBarUtilMobile.updateProgressBarInitPageValue();

                if (sessionStorage.isOnPreviousPage !== undefined && $.parseJSON(sessionStorage.isOnPreviousPage) === true) {
                    MobileRenderUtil.scrollFromNavigationToLastQuestion();
                    var question = GeneralQuestion.getLastQuestion();
                    if (question === undefined) return;
                    GeneralQuestion.setActiveClassForQuestionSettings(question);
                    me.selectedQuestion = question;
                    ProgressBarUtilMobile.setProgressBarValue();
                } else {
                    autoSelectFirstQuestion();
                }

                $(document).one('replaceContent', function () {
                    GeneralPagePreload.handlePreloadPages();
                });
            });
        }
    }

    function highlightQuestion(question, delay) {
        if (question === undefined) return;
        GeneralQuestion.setActiveClassForQuestionSettings(question);
        GeneralQuestion.handleUpdateQuestionAnswer(me.selectedQuestion);
        RenderUtil.moveTop(CONST.movingElementType.question, question, delay);
        me.selectedQuestion = question;

        //TODO: side effects
        ProgressBarUtilMobile.setProgressBarValue();
        InformationQuestion.showOkButton(me.selectedQuestion);
    }

    function windowScrollEvent(event) {
        //TODO need to move to mobile util (question per screen)
        if (event.type === 'touchstart') {
            $('#one-question-container').unbind('scroll');
        } else {
            //TODO don't call scroll up/down when user choose an option
            sessionStorage.isOnPreviousPage = false;
            QuestionPerScreen.processScrollingQuestion();
        }
    }

    me.DIRECTION = DIRECTION;
    me.CSS = CSS;
    me.SELECTOR = SELECTOR;
    me.CONST = CONST;
    me.CLASS_NAMES = GLOBAL_CONSTANTS.CLASS_NAMES;
    me.init = init;
    me.highlightQuestion = highlightQuestion;
    me.windowScrollEvent = windowScrollEvent;

    return me;
})();
