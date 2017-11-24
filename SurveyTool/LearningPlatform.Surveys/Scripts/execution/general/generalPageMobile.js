var GeneralPageMobile = (function () {
    var CONST = GLOBAL_CONSTANTS.CONST;
    var CSS = GLOBAL_CONSTANTS.CSS;

    return {
        isPreviousPageAvailable: isPreviousPageAvailable,
        ajaxLoadPage: ajaxLoadPage,
        handleAutoNextOrNextQuestion: handleAutoNextOrNextQuestion,
        hasSkipAction: hasSkipAction,
        isDynamicPage: isDynamicPage,
        getHiddenValue: getHiddenValue,
        handleReplacingCurrentPage: handleReplacingCurrentPage
    };

    function isPreviousPageAvailable(navigation) {
        return $(navigation).find('input[value=Previous]').length > 0;
    }

    function ajaxLoadPage(direction, delay) {
        if (window.ajaxLoading === false) return;

        var ajaxStartTime = new Date().getTime();
        $.ajax({
            type: "POST",
            url: window.location.href,
            data: $("form").serialize() + '&' + direction,
            beforeSend: function () {
                window.ajaxLoading = false;
            },
            success: function (pageContent) {
                var totalAjaxTime = new Date().getTime() - ajaxStartTime;
                // Replace current page need after animation durations (answer animation and scroll animation)
                var replaceHtmlDelayTime = delay + CSS.question.mobileDelay - totalAjaxTime < 0 ?
                    0 :
                    delay + CSS.question.mobileDelay - totalAjaxTime;
                sessionStorage.previousPageId = getHiddenValue('$pageId', document);
                replaceCurrentPage(pageContent, replaceHtmlDelayTime);
            },
            error: function () {
                console.log('Loading page is failed');
            }
        });
    }

    function replaceCurrentPage(pageContent, delay) {
        setTimeout(function () {
            var head = pageContent.substring(pageContent.indexOf('<head'), pageContent.indexOf('</head>') + '</head>'.length);
            var body = pageContent.substring(pageContent.indexOf('<body'), pageContent.indexOf('</body>') + '</body>'.length);

            $('html').attr('class', '');
            $('head').html(head);
            $('body').html(body);

            window.ajaxLoading = true;

            var replaceContentEvent = new CustomEvent("replaceContent", {
                cancelable: true
            });
            document.dispatchEvent(replaceContentEvent);
        }, delay);
    }

    function handleAutoNextOrNextQuestion(delay) {
        if (delay === undefined) delay = CONST.autoNextDelay;

        GeneralQuestionValidation.validate(IndexModule.selectedQuestion);
        if (IndexModule.selectedQuestion.errors && IndexModule.selectedQuestion.errors.length > 0) {
            GeneralQuestion.replaceQuestionErrorMessage(IndexModule.selectedQuestion);
            IndexModule.highlightQuestion(IndexModule.selectedQuestion);
        } else {
            GeneralQuestion.clearQuestionErrorMessage(IndexModule.selectedQuestion);
            var nextQuestion = GeneralQuestion.getNextQuestion(IndexModule.questions, IndexModule.selectedQuestion.id);
            if (nextQuestion === null) {
                autoTriggerPageNavigationButton(delay);
            } else {
                GeneralQuestionNavigationMobile.handleMoveSelectedQuestionDown(delay);
            }
        }
    }

    function autoTriggerPageNavigationButton(delay) {
        if (GeneralPage.isLastPage('.page-navigation') && GeneralQuestion.isLastQuestion(IndexModule.selectedQuestion.id)) return;

        var currentId = getHiddenValue('$pageId', document);
        GeneralPagePreload.stogePageToSession(currentId, $('html')[0].outerHTML);

        if (delay > 0) {
            setTimeout(function () {
                GeneralQuestionNavigationMobile.moveToNavigation();
            }, delay);
        } else {
            GeneralQuestionNavigationMobile.moveToNavigation();
        }

        $(document).one('moveTopDone', function () {
            handleReplacingCurrentPage('next');
        });
    }

    function hasSkipAction(htmlElement) {
        var hasSkipActions = $.trim($(htmlElement).find('[name="$hasSkipActions"]').val().toLowerCase());
        return hasSkipActions === 'true';
    }

    function isDynamicPage(htmlElement) {
        var isDynamicPage = $.trim($(htmlElement).find('[name="$isDynamicPage"]').val().toLowerCase());
        return isDynamicPage === 'true';
    }

    function getHiddenValue(name, htmlElement) {
        return $("[name='" + name + "']", htmlElement).val();
    }

    function handleReplacingCurrentPage(direction) {
        var pagesDataTable = GeneralPagePreload.getPreloadPagesDataTable();

        if (pagesDataTable) {
            var currentPageId = getHiddenValue('$pageId', document);
            GeneralPagePreload.stogePageToSession(currentPageId, $('html')[0].outerHTML);
            GeneralPagePreload.stogeCurrentFormToSession(currentPageId);

            var preLoadePageContent = '';
            if (direction === 'next') {
                sessionStorage.previousPageId = currentPageId;
                if (pagesDataTable[currentPageId].nextPageId !== undefined && pagesDataTable[currentPageId].nextPageId !== '') {
                    preLoadePageContent = GeneralPagePreload.getPreloadPage(pagesDataTable[currentPageId].nextPageId);
                    replaceCurrentPage(preLoadePageContent, 0);
                } else {
                    ajaxLoadPage('forward=Next', CSS.question.mobileDelay);
                }
            } else if (direction === 'previous') {
                sessionStorage.previousPageId = '';
                if (pagesDataTable[currentPageId].previousPageId !== undefined && pagesDataTable[currentPageId].previousPageId !== '') {
                    preLoadePageContent = GeneralPagePreload.getPreloadPage(pagesDataTable[currentPageId].previousPageId);
                    replaceCurrentPage(preLoadePageContent, 0);
                } else {
                    ajaxLoadPage('back=Previous', CSS.question.mobileDelay);
                }
            }
        } else {
            if (direction === 'next') {
                ajaxLoadPage('forward=Next', CSS.question.mobileDelay);
            } else if (direction === 'previous') {
                ajaxLoadPage('back=Previous', CSS.question.mobileDelay);
            }
        }
    }
})();
