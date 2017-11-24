var MobileRenderUtil = (function () {
    var CSS = GLOBAL_CONSTANTS.CSS;
    var CONST = GLOBAL_CONSTANTS.CONST;
    var lastWindowAngle = getWindowAngle();

    return {
        restyleUIOneQuestionPerPage: restyleUIOneQuestionPerPage,
        reBuildScaleQuestion: reBuildScaleQuestion,
        buildVirtualNavigationPages: buildVirtualNavigationPages,
        renderStyleQuestionOnActive: renderStyleQuestionOnActive,
        detectScrollDown: detectScrollDown,
        detectActivePageType: detectActivePageType,
        getActivePage: getActivePage,
        isHaveVirtualPage: isHaveVirtualPage,
        activatePage: activatePage,
        scrollFromNavigationToLastQuestion: scrollFromNavigationToLastQuestion,
        isIphoneOrIpod: isIphoneOrIpod,
        getWindowAngle: getWindowAngle,
        isChangedWindowAngle: isChangedWindowAngle,
        updateLastWindowAngle: updateLastWindowAngle,
        customizeScaleGridRadioStyle: customizeScaleGridRadioStyle
    };

    function restyleUIOneQuestionPerPage(questions) {
        var minHeight = window.innerHeight - parseInt($('#one-question-container').css('padding-top'));

        if (!GeneralPage.isThankYouPage()) {
            $('.previous-page').css({
                'min-height': +minHeight + 'px'
            });
            $('.next-page').css({
                'min-height': +minHeight + 'px'
            });
        }

        var questionSettingsMinHeight = window.innerHeight - $('.survey-progess-container').height();
        $('.question-settings').css({
            'min-height': questionSettingsMinHeight + 'px'
        });
        resetHeightFirstPage();
        reBuildProgressBar();
        customizeScaleGridRadioStyle();
    }

    function buildVirtualNavigationPages() {
        $('#one-question-container form')
            .prepend('<div class="page-navigation"><input id="virtual-previous" class="btn btn-default previous" type="submit" name="back" value="Previous" /></div>');
    }

    function resetHeightFirstPage() {
        var virtualPage = $('.previous-page');
        if (virtualPage.length > 0) return;

        var logoAreaHeight = $('img.logo').length > 0 ?
            $('img.logo').height() + parseInt($('img.logo').css('margin-bottom')) :
            0;

        var bottomPadding = isThankYouPage() ? parseInt($('#one-question-container').css('padding-bottom')) : 0;
        var firstPageHeight = window.innerHeight -
            logoAreaHeight -
            parseInt($('#one-question-container').css('padding-top')) -
            bottomPadding;

        IndexModule.questions[0].questionElement.parent().css({
            'min-height': firstPageHeight + 'px'
        });
    }

    function reBuildProgressBar() {
        $('.survey-progess-container').appendTo($('body'));
    }

    function reBuildScaleQuestion() {
        $('.question-settings').each(function (index, questionElement) {
            var tableHeader = $('.likert-table__likert-text-container', questionElement).html();
            $('.likert-table td.scale-button-section', questionElement)
                .prepend('<div class="likert-table__likert-text-container">' + tableHeader + '</div>');

            // Add number for each scale radios row
            var likerRadiosNotFirstRow = '.grid-selection.likert-table:not(.render-as-button) tbody tr:not([row-index="0"])';
            $(likerRadiosNotFirstRow, questionElement).append('<th>' + tableHeader + '</th>');

            var likerRadiosHeaderNumber = '.grid-selection.likert-table:not(.render-as-button) tr[row-index="0"] th.horizontal-header';
            $(likerRadiosHeaderNumber, questionElement)
                .each(function (indexNumber, elementNumber) {
                    var numberText = $(elementNumber).text();
                    var rowContext = $(likerRadiosNotFirstRow, questionElement);

                    $.each(rowContext, function (ind, elem) {
                        $($('td', elem).get(indexNumber))
                            .find('label').prepend(numberText);
                    });
                });
        });
    }

    function renderStyleQuestionOnActive(question) {
        //TODO why need to check with mobile class?
        if (!RenderUtil.isApplyOneQuestionPerPage()) return;
        var questionSettingElement = question.questionElement.parent();
        $('.question-settings').removeClass('active-trail');
        questionSettingElement.addClass('active-trail');
    }

    function detectScrollDown(event) {
        var activePage = getActivePage();
        if (event.type === 'touchstart') {
            IndexModule.scrollDirection.start = activePage.offset().top;
        }

        if (event.type === 'touchend') {
            if (IndexModule.scrollDirection.start > activePage.offset().top) {
                IndexModule.scrollDirection.down = true;
            } else if (IndexModule.scrollDirection.start < activePage.offset().top) {
                IndexModule.scrollDirection.down = false;
            } else {
                IndexModule.scrollDirection.down = null;
            }
        }
    }

    function detectActivePageType() {
        //Note: return 'virtual', 'question', 'navigation'
        if (IndexModule.selectedQuestion !== null) return 'question';
        if ($('.previous-page.active-trail').length > 0) return 'virtual';
        if ($('.next-page.active-trail').length > 0) return 'navigation';
        return '';
    }

    function getActivePage() {
        var activePageType = MobileRenderUtil.detectActivePageType();
        switch (activePageType) {
            case 'virtual':
                return $('.previous-page');
            case 'question':
                return IndexModule.selectedQuestion.questionElement.parent();
            case 'navigation':
                return $('.next-page');
        }
    }

    function isHaveVirtualPage() {
        return $('.previous-page').length > 0;
    }

    function activatePage(element) {
        var activeClassName = 'active-trail';
        $('*').removeClass(activeClassName);
        element.addClass(activeClassName);
    }

    function isThankYouPage() {
        return IndexModule.questions[0].questionElement.parent().attr('question-alias') === 'thankyou';
    }

    function scrollFromNavigationToLastQuestion() {
        $('#one-question-container').scrollTop($('.next-page').offset().top);
        RenderUtil.moveTop(CONST.movingElementType.question, GeneralQuestion.getLastQuestion(), GLOBAL_CONSTANTS.CSS.question.mobileDelay);
    }

    function isIphoneOrIpod() {
        return (/iPhone|iPod/i).test(navigator.userAgent);
    }

    function getWindowAngle() {
        return isIphoneOrIpod() ? window.orientation : window.screen.orientation.angle;
    }

    function isChangedWindowAngle(currentAngle){
        return lastWindowAngle !== currentAngle;
    }

    function updateLastWindowAngle(angle){
        lastWindowAngle = angle;
    }

    function customizeScaleGridRadioStyle() {
        $('.question-settings').each(function (index, questionElement) {
            var tableHeader = $('.likert-table__likert-text-container', questionElement).html();

            // Use css display grid
            var likerRadiosNotFirstRow = '.grid-selection.likert-table:not(.render-as-button) tbody tr:not([row-index="0"])';
            var likerRadiosColumn = '.grid-selection.likert-table:not(.render-as-button) tr[row-index="1"] td';
            var likerRadiosHeader = '.grid-selection.likert-table:not(.render-as-button) tbody tr th';
            $(likerRadiosHeader, questionElement).css(
                'grid-column', 1 + ' / ' + ($(likerRadiosColumn, questionElement).length + 1)
            );

            var likerRadiosRows = '.grid-selection.likert-table:not(.render-as-button) tr';
            $(likerRadiosRows, questionElement).each(function (rowInd, rowElement) {
                $('td', rowElement).each(function (cellIndex, cellElement) {
                    $(cellElement).css('left', getLeftPostionOption());

                    function getLeftPostionOption() {
                        var totalItems = $(likerRadiosColumn, questionElement).length;
                        var widthOfItem = $(likerRadiosColumn).width();
                        var availbleScreenWidth = $('form').width();

                        var spaceBetweenItems = (availbleScreenWidth - totalItems * widthOfItem) / (totalItems - 1);

                        var widthOfRemainItems = (totalItems - cellIndex) * widthOfItem;
                        var widthOfRemainSpaces = (totalItems - cellIndex - 1) * spaceBetweenItems;

                        return availbleScreenWidth - (widthOfRemainItems + widthOfRemainSpaces);
                    }
                });
            });
        });
    }
})();