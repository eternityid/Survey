var GLOBAL_CONSTANTS = (function () {
    var DIRECTION = {
        NEXT: 'Next',
        PREVIOUS: 'Previous'
    };

    var CSS = {
        question: {
            active: 'active',
            deactive: 'deactive',
            delay: 500,
            mobileDelay: 600,
            mobileDelayForLongText: 200,
            effectDistance: 200,
            type: {
                singleSelection: 'single-selection',
                pictureSingleSelection: 'picture-single-selection',
                pictureMultipleSelection: 'picture-multiple-selection',
                singleSelectionDropdown: 'single-selection-dropdown',
                multiSelection: 'multi-selection',
                information: 'information',
                likerScale: 'liker',
                gridSelection: 'grid-selection',
                shortText: 'short-text',
                longText: 'long-text',
                numericText: 'numeric-text',
                otherText: 'other-text',
                ratings: 'ratings',
                unknown: ''
            }
        },
        option: {
            active: 'active-option',
            deactive: 'deactive-option'
        }
    };

    var SELECTOR = {
        page: {
            root: navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ? 'html' : 'body',
            container: '.container',
            navigation: '.page-navigation',
            nextNavigation: '.page-navigation .next',
            previousNavigation: '.page-navigation .previous'
        },
        question: {
            type: {
                singleSelection: '.single-selection:not(.liker)',
                pictureSingleSelection: '.picture-single-selection',
                pictureMultipleSelection: '.picture-multiple-selection',
                singleSelectionDropdown: '.single-selection-dropdown',
                multiSelection: '.multi-selection',
                information: '.information',
                gridSelection: '.grid-selection',
                likerScale: '.liker',
                shortText: '.short-text',
                longText: '.long-text',
                numericText: '.numeric-text',
                otherText: '.other-text',
                ratings: '.ratings',
                date: '.date',
                unknown: ''
            },
            title: '.question .question-title',
            questionElement: '.question',
            getAllByDeactive: 'form > div.' + CSS.question.deactive,
            likerHeading: '.liker-heading .heading'
        },
        option: {
            types: [
                '.single-selection input[type=radio]',
                '.multi-selection input[type=checkbox]',
                '.liker .single-selection-option input[type=radio]',
                '.grid-selection input[type=radio]',
                '.grid-selection input[type=checkbox]',
                '.grid-selection td.short-text input[type=text]',
                '.grid-selection td.long-text textarea',
                '.ratings input[type=hidden]',
                '.picture-single-selection input[type=radio]',
                '.picture-multiple-selection input[type=checkbox]'
            ],
            active: '.' + CSS.option.active + ' input'
        }
    };

    var CONST = {
        defaultOptionId: 1,
        optionType: {
            none: 0,
            text: 1,
            select: 2
        },
        elementType: {
            text: 'text',
            textarea: 'textarea',
            input: 'input',
            number: 'number',
            submit: 'submit',
            radio: 'radio',
            checkbox: 'checkbox',
            select: 'select',
            selectOne: 'select-one'
        },
        movingElementType: {
            virtual: 'virtual-previous',
            question: 'question',
            navigation: 'navigation'
        },
        device: {
            virtualKeyboardDelayTime: 400
        },
        hotkeyDelay: 500,
        autoNextDelay: 700,
        selectedLikerButtonClass: 'selected',
        renderButtonHeadingClass: 'liker-heading',
        renderButtonClass: 'render-button',
        questionDataKey: 'question',
        notAllowAnswerMarkup: ["script", "javascript", "body", "head", "html", "style", "iframe", "video", "audio", "applet", "frameset", "font", "basefont", "noframes", "canvas"],
        templateHotKeyHr: '<span class="hotkeys-hrow">{0}</span>',
        templateHotKey: '<span class="hotkeys">{0}</span>',
        key: {
            upperChars: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
            lowerChars: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
            upperCharCodes: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90],
            lowerCharCodes: [97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122],
            numberCodes: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57],
            numpadCodes: [96, 97, 98, 99, 100, 101, 102, 103, 104, 105],
            negativeCodes: [109, 189]
        }
    };

    var CLASS_NAMES = {
        shortText: 'short-text',
        longText: 'long-text',
        otherText: 'other-text',
        numericText: 'numeric-text'
    };

    var KEY = {
        SHIFT: 16,
        TAB: 9,
        ENTER: 13,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,

        BACKSPACE: 8,
        ESC: 27,
        DEL: 127,

        UNIT_SEPARATOR: 31,
        COMMA: 44,
        HYPHEN: 45,
        PERIOD: 46,
        DIGIT_0: 48,
        DIGIT_9: 57
    };

    QUESTION_TYPES = {
        information: 'Information',
        numeric: 'Numeric',
        date: 'Date',
        shortText: 'ShortText',
        shortTextList: 'ShortTextList',
        longText: 'LongText',
        longTextList: 'LongTextList',
        singleSelection: 'SingleSelection',
        singleSelectionGrid: 'SingleSelectionGrid',
        multipleSelection: 'MultipleSelection',
        multipleSelectionGrid: 'MultipleSelectionGrid',
        pictureSingleSelection: 'PictureSingleSelection',
        pictureMultipleSelection: 'PictureMultipleSelection',
        rating: 'Rating',
        ratingGrid: 'RatingGrid',
        scale: 'Scale',
        scaleGrid: 'ScaleGrid',
        netPromoterScore: 'NetPromoterScore',
        languageSelection: 'LanguageSelection',
        matrix: 'Matrix'
    };

    QUESTION_VALIDATION_TYPES = {
        decimalPlacesNumberValidation: 'DecimalPlacesNumberValidation',
        lengthValidation: 'LengthValidation',
        rangeNumberValidation: 'RangeNumberValidation',
        regularExpressionValidation: 'RegularExpressionValidation',
        requiredValidation: 'RequiredValidation',
        selectionValidation: 'SelectionValidation',
        wordsAmountValidation: 'WordsAmountValidation'
    };

    ERROR_TYPES = {
        questionRequired: 'QuestionRequired',
        questionSelectionMinMax: 'QuestionSelectionMinMax',
        questionSelectionMin: 'QuestionSelectionMin',
        questionSelectionMax: 'QuestionSelectionMax',
        questionLengthMinMax: 'QuestionLengthMinMax',
        questionLengthMin: 'QuestionLengthMin',
        questionLengthMax: 'QuestionLengthMax',
        questionWordsAmountMinMax: 'QuestionWordsAmountMinMax',
        questionWordsAmountMin: 'QuestionWordsAmountMin',
        questionWordsAmountMax: 'QuestionWordsAmountMax',
        exclusiveViolation: 'ExclusiveViolation',
        questionNumberMinMax: 'QuestionNumberMinMax',
        questionNumberMin: 'QuestionNumberMin',
        questionNumberMax: 'QuestionNumberMax',
        questionNumberDecimalPlaces: 'QuestionNumberDecimalPlaces'
    };

    ERROR_MESSAGES = {
        questionRequired: 'This question is required.',
        questionSelectionMinMax: 'Please select at least {0} and no more than {1} options.',
        questionSelectionMin: 'Please select at least {0} options.',
        questionSelectionMax: 'Please select no more than {0} options.',
        questionLengthMinMax: 'Please enter at least {0} characters and no more than {1} characters in your answer.',
        questionLengthMin: 'Please enter at least {0} characters in your answer.',
        questionLengthMax: 'Please enter no more than {0} characters in your answer.',
        questionWordsAmountMinMax: 'Please enter at least {0} words  and no more than {1} words  in your answer.',
        questionWordsAmountMin: 'Please enter at least {0} words in your answer.',
        questionWordsAmountMax: 'Please enter no more than {0} words  in your answer.',
        exclusiveViolation: 'Please select only one option when option {0} is selected.',
        questionNumberMinMax: 'Please input at least {0} and no more than {1} value.',
        questionNumberMin: 'Please input at least {0} value.',
        questionNumberMax: 'Please input no more than {0} value.',
        questionNumberDecimalPlaces: 'Please input {0} decimal places correctly for {1} value.'
    };

    return {
        DIRECTION: DIRECTION,
        CSS: CSS,
        SELECTOR: SELECTOR,
        CONST: CONST,
        CLASS_NAMES: CLASS_NAMES,
        KEY: KEY,
        QUESTION_TYPES: QUESTION_TYPES,
        QUESTION_VALIDATION_TYPES: QUESTION_VALIDATION_TYPES,
        ERROR_TYPES: ERROR_TYPES,
        ERROR_MESSAGES: ERROR_MESSAGES
    };
})();