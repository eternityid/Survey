var EventUtil = (function () {
    var KEY = GLOBAL_CONSTANTS.KEY;
    var CONST = GLOBAL_CONSTANTS.CONST;

    return {
        stopEvent: stopEvent,
        isRelatedTab: isRelatedTab,
        blurOutEventElement: blurOutEventElement,
        raiseEventOnNumericDom: raiseEventOnNumericDom
    };

    function stopEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    function isRelatedTab(event) {
        return ArrayUtil.hasValueIn([KEY.TAB], event.keyCode) || (event.shiftKey && event.keyCode === KEY.TAB);
    }

    function blurOutEventElement(event) {
        var isElementCanBlur = ArrayUtil.hasValueIn([
            CONST.elementType.number, CONST.elementType.text, CONST.elementType.textarea,
            CONST.elementType.submit, CONST.elementType.select, CONST.elementType.selectOne
        ], event.target.type);

        if (isElementCanBlur) {
            $(event.target).blur();
        }
    }

    function raiseEventOnNumericDom() {
        var isChrome = !!window.chrome && !!window.chrome.webstore;
        if (!isChrome) {
            $('.number').on('keypress', function (event) {
                event = (event) ? event : window.event;

                var charCode = (event.which) ? event.which : event.keyCode;
                var isNavigationKey = [KEY.SHIFT, KEY.TAB, KEY.ENTER, KEY.LEFT, KEY.UP, KEY.RIGHT, KEY.DOWN].some(function (key) { return key === charCode; });
                var isControlKey = [KEY.BACKSPACE, KEY.ESC, KEY.DEL].some(function (key) { return key === charCode; });

                if (charCode === KEY.COMMA ||
                    charCode === KEY.HYPHEN ||
                    charCode === KEY.PERIOD ||
                    (charCode >= KEY.DIGIT_0 && charCode <= KEY.DIGIT_9) ||
                    isNavigationKey ||
                    isControlKey)
                {
                    return true;
                }

                return false;
            });
        }
    }
})();