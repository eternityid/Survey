var QuestionPerScreen = (function () {
    var CONST = GLOBAL_CONSTANTS.CONST;
    var CSS = GLOBAL_CONSTANTS.CSS;

    return {
        handleToggleVirtualKeyboard: handleToggleVirtualKeyboard,
        handleWindowResize: handleWindowResize,
        blurElementWhenScrolling: blurElementWhenScrolling,
        moveFromNavigationToLastQuestion: moveFromNavigationToLastQuestion,
        showOneQuestionPerPage: showOneQuestionPerPage,
        renderQuestionUI: renderQuestionUI,
        processScrollingQuestion: processScrollingQuestion
    };

    function processScrollingQuestion() {
        if (isCurrentQuestionAboveBottomLimitPoint()) {
            processActivePageDown();
        } else if (isCurrentQuestionBelowTopLimitPoint()) {
            processActivePageUp();
        } else {
            // Not passed bottom or top immediately after touch end, add scroll event to check
            $('#one-question-container').on('scroll', function () {
                if (isCurrentQuestionAboveBottomLimitPoint()) {
                    processActivePageDown();
                } else if (isCurrentQuestionBelowTopLimitPoint()) {
                    processActivePageUp();
                }
            });
        }
        return;
        // TODO: need to think a more meaningful name for magic number at limitedPointToGoNext and limitedPointToGoPrevious
        function isCurrentQuestionBelowTopLimitPoint() {
            if (!IndexModule.selectedQuestion) return false;
            var $questionSettings = $(IndexModule.selectedQuestion.questionElement).closest('.question-settings');
            var limitedPointToGoNext = MobileRenderUtil.isIphoneOrIpod() ?
                window.innerHeight * 0.2 : window.innerHeight * 0.3;
            return $questionSettings.offset().top >= limitedPointToGoNext;
        }

        function isCurrentQuestionAboveBottomLimitPoint() {
            if (!IndexModule.selectedQuestion) return false;
            var $questionSettings = $(IndexModule.selectedQuestion.questionElement).closest('.question-settings');
            var questionBottomOffset = $questionSettings.offset().top + $questionSettings.height();
            var limitedPointToGoPrevious = MobileRenderUtil.isIphoneOrIpod() ?
                window.innerHeight * 0.8 : window.innerHeight * 0.7;
            return questionBottomOffset <= limitedPointToGoPrevious;
        }
    }

    function processActivePageDown() {
        var selectedQuestion = IndexModule.selectedQuestion;

        if (selectedQuestion !== null) {
            if (GeneralQuestion.isLastQuestion(selectedQuestion.id)) {
                GeneralPageMobile.handleAutoNextOrNextQuestion(0);
                MobileRenderUtil.activatePage($('.next-page'));
            } else {
                //Scroll to next question
                var nextQuestion = GeneralQuestion.getNextQuestion(IndexModule.questions, selectedQuestion.id);
                moveQuestion(nextQuestion, selectedQuestion);

            }
        } else {
            // Scroll up from navigation
            moveFromVirtualPageToFirstQuestion();
        }
    }

    function moveFromVirtualPageToFirstQuestion() {
        $('#one-question-container').css('overflow-y', 'hidden');
        var firstQuestion = IndexModule.questions[0];
        GeneralQuestionNavigationMobile.moveQuestion(undefined, firstQuestion.id);
        MobileRenderUtil.activatePage(firstQuestion.questionElement.parent());
    }

    function processActivePageUp() {
        var selectedQuestion = IndexModule.selectedQuestion;
        var haveVirtualPage = MobileRenderUtil.isHaveVirtualPage();

        if (selectedQuestion !== null) {
            if (GeneralQuestion.isFirstQuestion(selectedQuestion.id)) {
                if (haveVirtualPage) {
                    moveToVirtualPage();
                    var delayTimeToReplacePageContent = 1000;
                    setTimeout(function () {
                        GeneralPageMobile.handleReplacingCurrentPage('previous');
                    }, delayTimeToReplacePageContent);
                }
            } else {
                //Scroll to previous question
                var previousQuestion = GeneralQuestion.getPreviousQuestion(IndexModule.questions, selectedQuestion.id);
                moveQuestion(previousQuestion, selectedQuestion);
            }
        } else {
            // Scroll up from navigation
            moveFromNavigationToLastQuestion();
        }
    }

    function moveToVirtualPage() {
        //TODO keep it for check dynamic page
        //$('input.previous[type=submit]').trigger('click');
        sessionStorage.isOnPreviousPage = true;
        MobileRenderUtil.activatePage($('.previous-page'));
        GeneralQuestionMobile.deactiveQuestion(IndexModule.selectedQuestion.id);
        RenderUtil.moveTop(CONST.movingElementType.virtual, null);
        IndexModule.selectedQuestion = null;
    }

    function moveQuestion(nextQuestion, currentQuestion) {
        var nextQuestionId = nextQuestion.id;
        $('#one-question-container').css('overflow-y', 'hidden');
        MobileRenderUtil.renderStyleQuestionOnActive(currentQuestion); //TODO why do we need to call for everytimes
        GeneralQuestionNavigationMobile.moveQuestion(currentQuestion.id, nextQuestionId);
    }

    function moveFromNavigationToLastQuestion() {
        $('#one-question-container').css('overflow-y', 'hidden');
        var lastQuestion = IndexModule.questions[IndexModule.questions.length - 1];
        GeneralQuestionNavigationMobile.moveQuestion(undefined, lastQuestion.id);
        MobileRenderUtil.activatePage(lastQuestion.questionElement.parent());
    }

    function handleToggleVirtualKeyboard() {
        // TODO: add other types later if find specific case can show virtual keyboard on mobile
        var focusedInputsCanShowVirtualKeyboard = 'textarea, input[type=text], input[type=number], input[type=date], input[type=datetime-local], input[type=email], input[type=month], input[type=password], input[type=search], input[type=tel], input[type=time], input[type=url]';
        var toggleBottomBarFunction;
        $(focusedInputsCanShowVirtualKeyboard).on('focus', function () {
            // Prevent bottom bar show when duration between focus and blur too short (Flash on android)
            clearTimeout(toggleBottomBarFunction);
            $('.page-navigation').hide();
            $('.survey-progess-container').hide();
        });
        $(focusedInputsCanShowVirtualKeyboard).on('blur', function () {
            clearTimeout(toggleBottomBarFunction);
            toggleBottomBarFunction = setTimeout(function () {
                $('.page-navigation').show();
                $('.survey-progess-container').show();
            }, CONST.device.virtualKeyboardDelayTime);
        });

        return;
    }

    function handleWindowResize() {
        $(window).on('resize', function () {
            var currentWindowAngle = MobileRenderUtil.getWindowAngle();
            var isChangedScreenOrientation = MobileRenderUtil.isChangedWindowAngle(currentWindowAngle);
            if (isChangedScreenOrientation) {
                var elementType;
                if (IndexModule.selectedQuestion) {
                    elementType = CONST.movingElementType.question;
                } else {
                    var activePage = MobileRenderUtil.detectActivePageType();
                    if (activePage === 'navigation') {
                        elementType = CONST.movingElementType.navigation;
                    } else {
                        elementType = CONST.movingElementType.virtual;
                    }
                }
                MobileRenderUtil.restyleUIOneQuestionPerPage(IndexModule.questions);
                RenderUtil.moveTop(elementType, IndexModule.selectedQuestion);
            } else {
                scrollToActiveOption();
            }
            MobileRenderUtil.updateLastWindowAngle(currentWindowAngle);
        });

        return;

        function scrollToActiveOption() {
            var focusingInputRef = $(document.activeElement);
            var isActiveElementOutOfWindow =
                focusingInputRef.offset().top + focusingInputRef.outerHeight() > window.innerHeight ||
                focusingInputRef.offset().top - focusingInputRef.outerHeight() < 0;
            if (isActiveElementOutOfWindow) {
                var questionOffsetTop = RenderUtil.calculateQuestionOffsetTop(IndexModule.selectedQuestion);
                var refSelectedQuestingSettings = $(IndexModule.selectedQuestion.questionElement).closest('.question-settings');
                var distanceFromfocusingInputToQuestionTop = focusingInputRef.offset().top -
                    refSelectedQuestingSettings.offset().top;
                var scrollTopPosition = questionOffsetTop + distanceFromfocusingInputToQuestionTop -
                    window.innerHeight + focusingInputRef.outerHeight();
                var additionalDistance = 0;
                if (GeneralQuestion.isFirstQuestion(IndexModule.selectedQuestion.id)) {
                    additionalDistance = $('img.logo').css('display') === "none" ? 0 :
                        RenderUtil.getLogoAreaHeight() + parseInt($('#one-question-container').css('padding-top'));
                }
                scrollTopPosition = scrollTopPosition + additionalDistance;
                $('#one-question-container').animate({
                    scrollTop: scrollTopPosition
                }, CSS.question.mobileDelayForLongText);
            }
        }
    }

    function blurElementWhenScrolling() {
        $('#one-question-container').on('touchmove', function () {
            if (document.activeElement !== null) {
                $(document.activeElement).blur();
            }
        });
    }

    function showOneQuestionPerPage() {
        $('#one-question-container').css({
            visibility: 'visible'
        }).addClass('show');
    }

    function renderQuestionUI() {
        if (RenderUtil.isNeedRenderQuestionUI()) {
            $('textarea').attr('rows', '3');

            if ($('.page-navigation .previous').length > 0) {
                $('.logo').hide();
                MobileRenderUtil.buildVirtualNavigationPages();
            }

            $('.page-navigation').each(function (index, element) {
                $(element).wrap('<div class="page-navigation-container ' + getNavigationClassByPosition(element) + '"></div>');
            });

            $('.page-navigation .next').wrap('<div class="page-navigation__button-container"><div class="page-navigation__button"></div></div>');
            $('.next-page .page-navigation').append($($('.progress-label').parent().addClass('survey-progess-container')));
            $('.survey-progess-container').wrapInner('<div class="page-navigation__progress-bar"></div>');
            MobileRenderUtil.restyleUIOneQuestionPerPage(IndexModule.questions);

            if (GeneralPage.isLastPage('.page-navigation')) {
                var lastQuestion = GeneralQuestion.getLastQuestion();
                lastQuestion.questionElement.parent().addClass('last-survey-question');
                $('.next-page .page-navigation').insertAfter(lastQuestion.questionElement);
                $('.page-navigation-container.next-page').hide();
            }

            if ($('.data-content').length > 0) {
                $('#full-screen-overlay').show().css({
                    'opacity': $('.data-content').css('opacity'),
                    'height': '100%'
                });
                $('.data-content').css('opacity', '0');
                $('#one-question-container').css('padding', '0 15px 0 0');
            }

            MobileRenderUtil.reBuildScaleQuestion();
            MobileRenderUtil.customizeScaleGridRadioStyle();

            function getNavigationClassByPosition(navigationElement) {
                return $(navigationElement).find('#virtual-previous').length > 0 ?
                    'previous-page' :
                    GeneralPage.isLastPage('.page-navigation') ? 'next-page finish' : 'next-page';
            }
        } else {
            // Stop re-render rating
            $('.ratings > span').remove();
        }
    }
})();