var Hotkey = (function () {
    var SELECTOR = GLOBAL_CONSTANTS.SELECTOR;
    var CONST = GLOBAL_CONSTANTS.CONST;
    var KEY = GLOBAL_CONSTANTS.KEY;

    return {
        settingHotkeys: settingHotkeys
    };

    function settingHotkeys(question) {
        var optionKeys = [];
        var keyCodes = [];

        removeHotkeys();
        var keys,
            isNumberTemplate,
            numberStars;
        if (question.type === SELECTOR.question.type.likerScale) {
            for (var index in question.options) {
                if (question.options.hasOwnProperty(index)) {
                    optionKeys.push($(question.options[index].optionElement).attr("position"));
                }
            }
        }
        else if (question.type === SELECTOR.question.type.singleSelection || question.type === SELECTOR.question.type.multiSelection) {
            keys = CONST.key.upperChars;
            isNumberTemplate = question.options.length > keys.length;
            for (var i = 0; i < question.options.length; i++) {
                var templateHotkey = CONST.templateHotKey.replace('{0}', isNumberTemplate ? (i + 1) : keys[i]);
                if (question.settings.direction) {
                    templateHotkey = CONST.templateHotKeyHr.replace('{0}', isNumberTemplate ? (i + 1) : keys[i]);
                    $(question.options[i].optionElement.parentNode).css("float", "none");
                }

                $(question.options[i].optionElement).before(templateHotkey);
                optionKeys.push(keys[i]);
            }
        }
        else if (question.type === SELECTOR.question.type.pictureSingleSelection || question.type === SELECTOR.question.type.pictureMultipleSelection) {
            keys = CONST.key.upperChars;
            isNumberTemplate = question.options.length > keys.length;
            for (var p = 0; p < question.options.length; p++) {
                $(question.options[p].optionElement.parentNode).find('.picture-hot-key').text(isNumberTemplate ? (p + 1) : keys[p]);
                optionKeys.push(keys[p]);
            }
        }
        else if (question.type === SELECTOR.question.type.ratings) {
            numberStars = $(question.options[0].optionElement).data('stop');
            for (var key = 0; key <= numberStars; key++) {
                optionKeys.push(key);
            }
        }

        var isDelay = isNeedDelayToChooseOption();
        var delay = CONST.hotkeyDelay;

        if (isDelay) {
            var maxlength = 1;
            question.options.forEach(function (option) {
                maxlength = option.optionElement.title.length > maxlength ? option.optionElement.title.length : maxlength;
            });
            if (maxlength >= 4) delay += maxlength * (CONST.hotkeyDelay * 0.2);
        }

        $(document).on('keydown.option', { optionKeys: optionKeys }, throttle(function (event) {
            if (IndexModule.selectedQuestion === null || !keyCodes.length) return;
            if (!isApplyHotKeys(event) || !isQuestionSupportHotKeys(IndexModule.selectedQuestion)) {
                event.stopPropagation();
                return;
            }
            if (keyCodes[0] === KEY.SHIFT) {
                keyCodes.shift();
                if (!keyCodes.length) return;
            }

            var value = convertHotKeysToValue(keyCodes);
            var deselectValue = 0;
            keyCodes = [];

            var delay,
                isAutoSelectOption = false;
            if (question.type === SELECTOR.question.type.ratings) {
                $(question.options[0].optionElement).rating('rate', value);
                if (parseInt($(question.options[0].optionElement).rating('rate')) === value && value !== deselectValue) {
                    GeneralQuestionValidation.handleCheckingValidate(question);
                    GeneralPageDesktop.handleAutoNextOrNextQuestion(delay, isAutoSelectOption);
                }
                return;
            }
            if (QuestionType.isRatingGridQuestion(question)) {
                $(question.options[question.selectedOptionId - 1].optionElement).rating('rate', value);
                if (parseInt($(question.options[question.selectedOptionId - 1].optionElement).rating('rate')) === value && value !== deselectValue) {
                    GeneralQuestionValidation.handleCheckingValidate(question);
                    if (!GeneralQuestionValidation.isQuestionAnswered(question)) {
                        $('.ok-button').removeClass('show');
                    } else {
                        GeneralQuestion.activateOKButton(question);
                    }
                }
                return;
            }
            if (QuestionType.isLikertGridQuestion(question)) {
                GeneralQuestionValidation.handleCheckingValidate(question);
                var likertOptionValues = GridQuestion.getSequenceOfOptionValueInLikertGrid(question);
                if (likertOptionValues.length < 1) return;
                question.selectedOptionId = getNextSelectedOptionIdByHotKey(likertOptionValues);
                var selectedOption = question.options[question.selectedOptionId - 1];
                selectedOption.optionElement.checked = true;
                IndexModule.highlightOption(question);
                if (question.settings.isRenderOptionByButton) {
                    QuestionWithOption.selectOptionRenderToButton(true);
                }
                if (!GeneralQuestionValidation.isQuestionAnswered(question)) {
                    $('.ok-button').removeClass('show');
                } else {
                    GeneralQuestion.activateOKButton(question);
                }
                return;
            }
            var optionIndex = convertValueToIndex(value, question.options);
            if (optionIndex < 0 || optionIndex >= question.options.length) return;

            var option = question.options[optionIndex];
            question.selectedOptionId = option.id;
            option.optionElement.checked = (ArrayUtil.hasValueIn([SELECTOR.question.type.singleSelection, SELECTOR.question.type.likerScale, SELECTOR.question.type.pictureSingleSelection], question.type) ? true : !option.optionElement.checked);
            QuestionWithOption.selectOptionRenderToButton(option.optionElement.checked);

            GeneralQuestionDesktop.deactiveOptions(question);
            if (SELECTOR.question.type.pictureSingleSelection === question.type || SELECTOR.question.type.pictureMultipleSelection === question.type) {
                PictureQuestionDesktop.handleSelectedPictureOption(IndexModule.selectedQuestion);
                PictureQuestionDesktop.hightlightPictureOption(IndexModule.selectedQuestion);
            } else {
                $(option.optionElement.parentNode).removeClass(IndexModule.CSS.option.deactive).addClass(IndexModule.CSS.option.active);
                QuestionWithOption.focusOtherTextBySelectedOption(IndexModule.selectedQuestion);
            }
            GeneralQuestionValidation.handleCheckingValidate(question);
            if (GeneralQuestionValidation.isFinishSingleAnswer(question)) {
                GeneralPageDesktop.handleAutoNextOrNextQuestion(delay, isAutoSelectOption);
            } else {
                if (!GeneralQuestionValidation.isQuestionAnswered(question)) {
                    $('.ok-button').removeClass('show');
                } else {
                    GeneralQuestion.activateOKButton(question);
                }
            }
            return;

            function getNextSelectedOptionIdByHotKey(availableValues) {
                if (availableValues.indexOf(value) < 0) return question.selectedOptionId;
                var firstOptionIdOfSelectedRow = question.selectedOptionId % availableValues.length === 0 ?
                    question.selectedOptionId - availableValues.length + 1 :
                    question.selectedOptionId - (question.selectedOptionId % availableValues.length) + 1;
                Math.floor(question.selectedOptionId / availableValues.length);
                return firstOptionIdOfSelectedRow + availableValues.indexOf(value);
            }
        }));
        return;

        function isNeedDelayToChooseOption() {
            var needDelay = false;

            switch (question.type) {
                case SELECTOR.question.type.likerScale:
                    needDelay = question.options.some(function (option) {
                        return Number(option.optionElement.title) > 9 || Number(option.optionElement.title) < 0;
                    });
                    break;
                case SELECTOR.question.type.singleSelection:
                case SELECTOR.question.type.multiSelection:
                    needDelay = question.options.length > CONST.key.upperChars.length;
                    break;
                case SELECTOR.question.type.ratings:
                    needDelay = numberStars > 9;
                    break;
                case SELECTOR.question.type.gridSelection:
                    if (QuestionType.isLikertGridQuestion(question)) {
                        needDelay = GridQuestion.getSequenceOfOptionValueInLikertGrid(question).some(function (optionValue) {
                            return String(optionValue).length > 1;
                        });
                    } else if (QuestionType.isRatingGridQuestion(question)) {
                        needDelay = GridQuestion.getDataStopOfRatingGridQuestion(question) >= 10;
                    }
                    break;
            }
            return needDelay;
        }

        function throttle(func) {
            var timer = null;
            return function () {
                var context = this, args = arguments;

                var event = arguments[0];
                keyCodes.push(event.keyCode);

                clearTimeout(timer);
                timer = window.setTimeout(function () {
                    func.apply(context, args);
                }, isDelay ? delay || CONST.hotkeyDelay : 0);
            };
        }

        function isApplyHotKeys(event) {
            return event.target.nodeName.toLowerCase() === 'body';
        }

        function isQuestionSupportHotKeys(selectedQuestion) {
            var supportedTypes = [
                SELECTOR.question.type.singleSelection,
                SELECTOR.question.type.multiSelection,
                SELECTOR.question.type.pictureSingleSelection,
                SELECTOR.question.type.pictureMultipleSelection,
                SELECTOR.question.type.likerScale,
                SELECTOR.question.type.ratings
            ];
            return (ArrayUtil.hasValueIn(supportedTypes, selectedQuestion.type) ||
                QuestionType.isRatingGridQuestion(selectedQuestion) ||
                QuestionType.isLikertGridQuestion(selectedQuestion));
        }

        function convertHotKeyToIndex(code) {
            var hotkeyIndex = CONST.key.numberCodes.indexOf(code);
            if (hotkeyIndex < 0) hotkeyIndex = CONST.key.numpadCodes.indexOf(code);
            return hotkeyIndex;
        }

        function convertHotKeyToValue(code) {
            var hotkeyIndex = CONST.key.upperCharCodes.indexOf(code);
            if (hotkeyIndex < 0) hotkeyIndex = CONST.key.lowerCharCodes.indexOf(code);
            return CONST.key.upperChars[hotkeyIndex];
        }

        function convertHotKeysToValue(codes) {
            if (isCharHotkey(codes)) {
                return convertHotKeyToValue(codes[0]);
            }

            var indexes = [];
            var isNegativeNumber = ArrayUtil.hasValueIn(CONST.key.negativeCodes, codes[0]);
            if (isNegativeNumber) codes.shift();

            for (var j = 0; j < codes.length; j++) {
                var hotkeyIndex = convertHotKeyToIndex(codes[j]);
                if (hotkeyIndex < 0) break;
                indexes.push(hotkeyIndex);
            }
            return Number(indexes.join("")) * (isNegativeNumber ? -1 : 1);

            function isCharHotkey() {
                var firstCharCode = codes[0];
                return firstCharCode >= CONST.key.upperCharCodes[0] && firstCharCode <= CONST.key.upperCharCodes[CONST.key.upperCharCodes.length - 1];
            }
        }

        function convertValueToIndex(value, options) {
            if (value !== "" && isNaN(value)) {
                return CONST.key.upperChars.indexOf(value);
            }
            return options.findIndex(function (option) {
                return Number(option.optionElement.value) === Number(value);
            });
        }

        function removeHotkeys() {
            if (IndexModule.questions === null || IndexModule.questions === undefined) return;
            $(document).off('keydown.option');

            for (var k = 0; k < IndexModule.questions.length; k++) {
                var questionForHotkey = IndexModule.questions[k];
                if (!questionForHotkey.options) continue;
                if (questionForHotkey.type !== SELECTOR.question.type.pictureSingleSelection || questionForHotkey.type !== SELECTOR.question.type.pictureMultipleSelection) {
                    for (var m = 0; m < questionForHotkey.options.length; m++) {
                        $(questionForHotkey.options[m].optionElement.parentNode).find('.picture-hot-key').text('');
                    }
                }
                if (questionForHotkey.type !== SELECTOR.question.type.singleSelection && questionForHotkey.type !== SELECTOR.question.type.multiSelection) continue;
                for (var n = 0; n < questionForHotkey.options.length; n++) {
                    var option = $(questionForHotkey.options[n].optionElement);
                    var hotkey = option.prev('span.hotkeys, span.hotkeys-hrow');
                    if (hotkey && hotkey.length > 0) hotkey.remove();
                }
            }
        }
    }
})();