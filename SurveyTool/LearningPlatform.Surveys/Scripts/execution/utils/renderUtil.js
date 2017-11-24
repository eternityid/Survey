var RenderUtil = (function () {
    var SELECTOR = GLOBAL_CONSTANTS.SELECTOR;
    var CSS = GLOBAL_CONSTANTS.CSS;
    var CONST = GLOBAL_CONSTANTS.CONST;

    return {
        moveTop: moveTop,
        moveTopByPosition: moveTopByPosition,
        isApplyOneQuestionPerPage: isApplyOneQuestionPerPage,
        calculateQuestionOffsetTop: calculateQuestionOffsetTop,
        isNeedRenderQuestionUI: isNeedRenderQuestionUI,
        getLogoAreaHeight: getLogoAreaHeight
    };

    function moveTop(type, question, delay) {
        var offsetTop = parseInt($('#one-question-container').css('padding-top'));

        if (isApplyOneQuestionPerPage()) {
            $('#one-question-container').unbind('scroll');

            if (type === CONST.movingElementType.virtual) {
                offsetTop = $('.previous-page').offset().top;
            } else if (type === CONST.movingElementType.navigation) {
                offsetTop = $('form').height();
            } else if (question && question.questionElement) {
                MobileRenderUtil.renderStyleQuestionOnActive(question);
                offsetTop = calculateQuestionOffsetTop(question);
            }
            if (delay === undefined) delay = CSS.question.mobileDelay;
            if (offsetTop !== -1) {
                $('#one-question-container').animate({
                    scrollTop: offsetTop
                }, delay, function () {
                    $('#one-question-container').css('overflow-y', 'scroll');
                    var moveTopDoneEvent = new CustomEvent("moveTopDone", {
                        cancelable: true
                    });
                    document.dispatchEvent(moveTopDoneEvent);
                });
            }
        } else {
            if (question.questionElement) {
                var balancedTopOffsetFromViewport = (window.innerHeight - question.questionElement.height()) / 2;
                // if question height is larger than viewport height
                if (balancedTopOffsetFromViewport < 0) balancedTopOffsetFromViewport = 0;
                offsetTop = question.questionElement.offset().top - balancedTopOffsetFromViewport;
            } else {
                offsetTop = $(document).height();
            }
            if (offsetTop !== -1) {
                if (delay === undefined) delay = CSS.question.delay;
                var scrollableContainers = 'html, body';
                $(scrollableContainers).animate({
                    scrollTop: offsetTop
                }, delay);
            }
        }
    }

    function calculateQuestionOffsetTop(question) {
        var pagePaddingTop = parseInt($('#one-question-container').css('padding-top'));

        var firstQuestionTop = pagePaddingTop;
        if ($('.previous-page').length < 1) {
            firstQuestionTop = GeneralQuestion.isFirstQuestion(question.id) ? 0 : getLogoAreaHeight() + pagePaddingTop;
        }

        var offsetTop = question.questionElement.parent().offset().top - question.questionElement.parent().parent().offset().top + firstQuestionTop;
        return offsetTop;
    }

    function getLogoAreaHeight() {
        var element = $('img.logo');
        return element && element.length > 0 ? (element.outerHeight(true) || 0) : 0;
    }

    function isApplyOneQuestionPerPage() {
        //TODO should remove me
        var hidden = $('#one-question-per-page');
        return hidden && Boolean(hidden.val()) && isMobile();
    }

    function isMobile() {
        return (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }

    function moveTopByPosition(offsetValue, delay) {
        var scrollableContainers = 'html, body';
        $(scrollableContainers).animate({
            scrollTop: offsetValue
        }, delay);
    }

    function isNeedRenderQuestionUI() {
        return $('.page-navigation-container').length < 1;
    }

})();