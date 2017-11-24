(function () {
    //TODO need to separate this class: question, L&F
    var CONST = {
        CommandType: {
            PageTitle: 'PageTitle',
            PageDescription: 'PageDescription',
            NavigationBtnSetting: 'NavigationBtnSetting',
            UpdateWholeQuestion: 'UpdateWholeQuestion',
            QuestionTitle: 'QuestionTitle',
            QuestionDescription: 'QuestionDescription',
            AdvanceSetting: {
                Required: 'AdvanceSetting_Required',
                AlwaysHidden: 'AdvanceSetting_AlwaysHidden'
            },
            LongText: {
                AdvancedSettings: 'LongText_AdvancedSettings'
            },
            Scale: {
                Content: 'Scale_Content'
            },
            NetPromoterScore: {
                Content: 'NetPromoterScore_Content'
            },
            Rating: {
                Content: 'Rating_Content'
            },
            SimpleSelection: {
                Content: 'SimpleSelection_Content'
            },
            SimpleOptionGroupHeader: {
                Content: 'SimpleOptionGroupHeader_Content'
            },
            PictureSelection: {
                IsPictureShowLabel: 'PictureSelection_IsPictureShowLabel',
                Content: 'PictureSelection_Content'
            },
            TextList: {
                TopicTitles: 'TextList_TopicTitles',
                SubLongTextQuestionSize: 'TextList_SubLongTextQuestionSize'
            },
            SelectionGrid: {
                Content: 'SelectionGrid_Content'
            },
            Theme: {
                Content: 'Theme_Content'
            },
            ScaleGrid: {
                TopicTitles: 'ScaleGrid_TopicTitles',
                LikertText: 'ScaleGrid_LikertText'
            },
            RatingGrid: {
                TopicTitles: 'RatingGrid_TopicTitles',
                SubQuestionContent: 'RatingGrid_SubQuestionContent'
            }
        },
        NavigationBtnSetting: {
            Default: 0,
            ForwardOnly: 1,
            None: 2
        }
    };

    window.addEventListener('message', function (event) {
        var tempUrl = event.origin + '/';
        if (window.surveyCreatorUrl === undefined || tempUrl.indexOf(window.surveyCreatorUrl) === -1) return;

        var commandData = event.data;
        if (document.readyState !== 'complete') {
            var checkDocumentReadyInterval = setInterval(function () {
                if (document.readyState !== 'complete') return;
                clearInterval(checkDocumentReadyInterval);
                executeCommand(commandData);
            }, 100);
        } else {
            executeCommand(commandData);
        }

        reRenderQuestionsUI();

        function executeCommand(commandData) {
            switch (commandData.type) {
                case CONST.CommandType.PageTitle:
                    updatePageTitle(commandData.value);
                    break;
                case CONST.CommandType.PageDescription:
                    updatePageDescription(commandData.value);
                    break;
                case CONST.CommandType.NavigationBtnSetting:
                    updatePageNavigationBtnSetting(commandData.value);
                    break;
                case CONST.CommandType.UpdateWholeQuestion:
                    updateWholeQuestion(commandData.value);
                    break;
                case CONST.CommandType.QuestionTitle:
                    updateQuestionTitle(commandData.value);
                    break;
                case CONST.CommandType.QuestionDescription:
                    updateQuestionDescription(commandData.value);
                    break;
                case CONST.CommandType.AdvanceSetting.Required:
                    updateQuestionRequired(commandData.value);
                    break;

                case CONST.CommandType.LongText.AdvancedSettings:
                    updateLongTextAdvancedSettings(commandData.value);
                    break;
                case CONST.CommandType.Scale.Content:
                    updateScaleContent(commandData.value);
                    break;
                case CONST.CommandType.NetPromoterScore.Content:
                    updateNetPromoterScoreContent(commandData.value);
                    break;
                case CONST.CommandType.Rating.Content:
                    updateRatingContent(commandData.value);
                    break;
                case CONST.CommandType.SimpleSelection.Content:
                    updateSimpleSelectionContent(commandData.value);
                    break;
                case CONST.CommandType.SimpleOptionGroupHeader.Content:
                    updateSimpleOptionGroupHeaderContent(commandData.value);
                    break;
                case CONST.CommandType.PictureSelection.IsPictureShowLabel:
                    updatePictureSelectionIsPictureShowLabel(commandData.value);
                    break;
                case CONST.CommandType.PictureSelection.Content:
                    updatePictureSelectionContent(commandData.value);
                    break;
                case CONST.CommandType.TextList.TopicTitles:
                    updateTextListTopicTitles(commandData.value);
                    break;
                case CONST.CommandType.TextList.SubLongTextQuestionSize:
                    updateTextListSubLongTextQuestionSize(commandData.value);
                    break;
                case CONST.CommandType.SelectionGrid.Content:
                    updateSelectionGridContent(commandData.value);
                    break;
                case CONST.CommandType.ScaleGrid.TopicTitles:
                    updateScaleGridTitles(commandData.value);
                    break;
                case CONST.CommandType.ScaleGrid.LikertText:
                    updateScaleGridLikertText(commandData.value);
                    break;
                case CONST.CommandType.RatingGrid.TopicTitles:
                    updateRatingGridTitles(commandData.value);
                    break;
                case CONST.CommandType.RatingGrid.SubQuestionContent:
                    updateRatingGridSubQuestion(commandData.value);
                    break;
                case CONST.CommandType.AdvanceSetting.AlwaysHidden:
                    updateAlwaysHiddenMessage(commandData.value);
                    break;
                case CONST.CommandType.Theme.Content:
                    updateThemeContent(commandData.value);
                    break;
            }
        }

        function reRenderQuestionsUI() {
            reRenderRatingGrid();
            return;

            function reRenderRatingGrid() {
                $('.grid-selection.rating-table .rating-symbol .rating-number').each(function (index, element) {
                    $(element).prependTo($(element).parent());
                });
            }
        }
    });

    function updateWholeQuestion(value) {
        var $valueElement = $(value);
        var $questionSettingEl = $valueElement.find('.question-settings');
        if ($questionSettingEl.length > 0) {
            $('.question-settings').replaceWith($questionSettingEl);
        } else {
            $('.question-settings').replaceWith($valueElement);
        }
    }

    function updatePageTitle(value) {
        $('.page-title').html(value.pageTitle);
    }

    function updatePageDescription(value) {
        $('.page-description').html(value.pageDescription);
    }

    function updatePageNavigationBtnSetting(value) {
        switch (value.NavigationBtnSetting) {
            case CONST.NavigationBtnSetting.Default:
                $('.page-navigation .previous').css("display", "Block");
                $('.page-navigation .next').css("display", "Block");
                break;
            case CONST.NavigationBtnSetting.ForwardOnly:
                $('.page-navigation .previous').css("display", "none");
                $('.page-navigation .next').css("display", "Block");
                break;
            case CONST.NavigationBtnSetting.None:
                $('.page-navigation .previous').css("display", "none");
                $('.page-navigation .next').css("display", "none");
                break;
        }
    }

    function updateQuestionTitle(value) {
        $('.question-title .title').html(value);
        if (!isValidQuestionTitle(value)) {
            $('.question-settings').hide();
        }
        else {
            $('.question-settings').show();
        }

        function isValidQuestionTitle(questionTitle) {
            var wrappedQuestionTitle = document.createElement('div');
            wrappedQuestionTitle.innerHTML = questionTitle;
            if (!isEmptyText(wrappedQuestionTitle)) return true;
            var acceptedHtmlTags = ['img', 'video'];
            if (haveAnyHtmlTagsWith(wrappedQuestionTitle, acceptedHtmlTags)) return true;
            return false;
        }

        function isEmptyText(source) {
            var plainText = $(source).text().trim();
            if (!plainText) return true;
            return false;
        }

        function haveAnyHtmlTagsWith(source, acceptedHtmlTags) {
            for (var index in acceptedHtmlTags) {
                var accetedHtmlTag = acceptedHtmlTags[index];
                var htmlTagList = $(source).find(accetedHtmlTag);
                var filteredHtmlTagList = filterFollowHtmlTagCondition(htmlTagList, accetedHtmlTag);
                if (filteredHtmlTagList.length) return true;
            }
            return false;

            function filterFollowHtmlTagCondition(htmlTagList, HtmlTag) {
                switch (HtmlTag) {
                    case 'img':
                        return htmlTagList.filter(function (index) {
                            return $(this).attr('src') !== undefined;
                        });
                    case 'video':
                        return htmlTagList.filter(function (index) {
                            return $('source', this).attr('src') !== undefined;
                        });
                    default:
                        break;
                }
                return [];
            }
        }

    }

    function updateQuestionDescription(value) {
        $('.question-description').html(value);
    }

    function updateQuestionRequired(value) {
        var elements = $('.requiredMark');
        if (elements.length > 0) {
            if (value === true) {
                $('.requiredMark').show();
            } else {
                $('.requiredMark').hide();
            }
        }
    }

    function resetRatingElement(element) {
        $(element).parent().find('span').remove();
        $(element).data('rating', null);
        $(element).off();
        $(element).rating();
    }

    function updateLongTextAdvancedSettings(value) {
        if ($.isNumeric(value.Rows) && parseInt(value.Rows) > 0)
            $('textarea').attr('rows', value.Rows);
    }

    function updateScaleContent(value) {
        $('.left.scale-text').html(value.leftText);
        $('.center.scale-text').html(value.centerText);
        $('.right.scale-text').html(value.rightText);
    }

    function updateNetPromoterScoreContent(value) {
        $('.left.scale-text').html(value.leftText);
        $('.right.scale-text').html(value.rightText);
    }

    function updateRatingContent(value) {
        $('input.rating').data('stop', value.steps);
        $('input.rating').data('filled', value.shape);
        $('input.rating').data('empty', value.shape + '-empty');

        resetRatingElement($('input.rating'));
    }

    function updateSimpleSelectionContent(value) {
        var optionTitleElements = null;

        switch (value.displayOrientation) {
            case 0:
                optionTitleElements = $('.inputArea span.selection-option-title');
                break;
            case 1:
                optionTitleElements = $('.inputArea .heading label');
                break;
            case 2:
                optionTitleElements = $('select .selection-option-title');
                break;
        }

        if (optionTitleElements) {
            for (var i = 0; i < optionTitleElements.length && i < value.optionTitles.length; i++) {
                optionTitleElements[i].innerHTML = value.optionTitles[i];
            }
        }
    }

    function updateSimpleOptionGroupHeaderContent(value) {
        var optionGroupHeaderElements = $('.inputArea label.option-group');

        if (optionGroupHeaderElements) {
            for (var i = 0; i < optionGroupHeaderElements.length && i < value.optionGroupHeaderTitles.length; i++) {
                optionGroupHeaderElements[i].innerHTML = value.optionGroupHeaderTitles[i];
            }
        }
    }

    function updatePictureSelectionIsPictureShowLabel(value) {
        if (value === true) {
            $('.selection-option-title').show();
        } else {
            $('.selection-option-title').hide();
        }
    }

    function updatePictureSelectionContent(value) {
        var optionTitleElements = $('.inputArea .selection-option-title');
        if (optionTitleElements) {
            for (var i = 0; i < optionTitleElements.length; i++) {
                optionTitleElements[i].innerHTML = value[i];
            }
        }
    }

    function updateTextListTopicTitles(value) {
        var topicTitleElements = $('table tbody tr .vertical-header');
        if (topicTitleElements) {
            for (var i = 0; i < topicTitleElements.length; i++) {
                topicTitleElements[i].innerHTML = value[i];
            }
        }
    }

    function updateTextListSubLongTextQuestionSize(value) {
        var textAreaElements = $('table tbody tr textarea');
        if (!textAreaElements) return;
        for (var i = 0; i < textAreaElements.length; i++) {
            var textArea = textAreaElements[i];
            textArea.rows = value.Rows;
        }
    }

    function updateSelectionGridContent(value) {
        var topicTitleElements, optionTitleElements;

        if (value.transposed) {
            topicTitleElements = $('table tbody tr .horizontal-header');
            optionTitleElements = $('table tbody tr .vertical-header');
        } else {
            topicTitleElements = $('table tbody tr .vertical-header');
            optionTitleElements = $('table tbody tr .horizontal-header');
        }

        if (topicTitleElements) {
            for (var i = 0; i < topicTitleElements.length; i++) {
                topicTitleElements[i].innerHTML = value.topicTitles[i];
            }
        }

        if (optionTitleElements) {
            for (var j = 0; j < optionTitleElements.length; j++) {
                optionTitleElements[j].innerHTML = value.optionTitles[j];
            }
        }
    }

    function updateScaleGridTitles(value) {
        var topicTitleElements = $('table tbody tr .vertical-header');
        if (topicTitleElements) {
            for (var i = 0; i < topicTitleElements.length; i++) {
                topicTitleElements[i].innerHTML = value[i];
            }
        }
    }

    function updateScaleGridLikertText(value) {
        var likertTextElements = $('.likert-table__likert-text-container div');
        if (likertTextElements) {
            for (var i = 0; i < likertTextElements.length; i++) {
                likertTextElements[i].innerHTML = value[i];
            }
        }
    }

    function updateRatingGridTitles(value) {
        var topicTitleElements = $('table tbody tr .vertical-header');
        if (topicTitleElements) {
            for (var i = 0; i < topicTitleElements.length; i++) {
                topicTitleElements[i].innerHTML = value[i];
            }
        }
    }

    function updateRatingGridSubQuestion(value) {
        var ratingElements = $('input.rating');
        if (ratingElements) {
            for (var i = 0; i < ratingElements.length; i++) {
                var element = $(ratingElements[i]);
                element.data('stop', value.steps);
                element.data('filled', value.shape);
                element.data('empty', value.shape + '-empty');
                resetRatingElement(element);
            }
        }
    }

    function updateAlwaysHiddenMessage(value) {
        $('.question-hidden-message').html(value);
    }

    function updateThemeContent(value) {
        if (typeof value === 'object' && Object.keys(value).length === 0) {
            return;
        }
        updateBackgroundColorAndFont();
        updateQuestionTitleColor();
        updateQuestionDescriptionColor();
        updateErrorTextColor();
        updatePrimaryButtonBackgroundColor();
        updateProgressBar();
        updateDefaultButtonBackgroundColor();
        updateOpacity();
        updateQuestionContentColor();
        updateBackgroundAttributes();
        updateBackgroundColorAndOpacity();
        updatePageSetting();

        function updateBackgroundColorAndFont() {
            var container = $('.container');
            if (container) {
                container.css('background-color', value.backgroundColor);
                container.css('font-family', value.font);
            }
        }

        function updateQuestionTitleColor() {
            var questionTitle = $('.question-title');
            if (questionTitle) {
                questionTitle.css('color', value.questionTitleColor);
            }
        }

        function updateQuestionDescriptionColor() {
            var questionDescription = $('.question-description');
            if (questionDescription) {
                questionDescription.css('color', value.questionDescriptionColor);
            }
        }

        function updateErrorTextColor() {
            var error = $('.container .alert-warning');
            if (error) {
                error.css({
                    'color': value.errorColor,
                    'background-color': value.errorBackgroundColor
                });
            }
        }

        function updatePrimaryButtonBackgroundColor() {
            var primaryButton = $('.container .page-navigation .btn-primary');
            if (primaryButton) {
                primaryButton.css({
                    'background-color': value.primaryButtonBackgroundColor,
                    'border-color': value.primaryButtonBackgroundColor,
                    'color': value.primaryButtonColor
                });
            }
        }
        function updateProgressBar() {
            var primaryButton = $('.container .progress-bar');
            if (primaryButton) {
                primaryButton.css({
                    'background-color': value.primaryButtonBackgroundColor,
                    'color': value.primaryButtonColor
                });
            }
        }

        function updateDefaultButtonBackgroundColor() {
            var defaultButton = $('.container .page-navigation .btn-default');
            if (defaultButton) {
                defaultButton.css({
                    'background-color': value.defaultButtonBackgroundColor,
                    'color': value.defaultButtonColor
                });
            }
        }

        function updateOpacity() {
            ['.active', '.deactive'].forEach(function (item) {
                var element = $(item);
                if (element) element.css('opacity', value.inactiveOpacity);
            });
        }


        function updateQuestionContentColor() {
            [
                '.container .question-description-information',
                '.container .inputArea .single-selection',
                '.container .inputArea .single-selection-option',
                '.container .inputArea .multi-selection-option',
                '.container .inputArea .grid-selection',
                '.container .inputArea .heading',
                '.container .inputArea .scale-text',
                '.container .inputArea .rating-index',
                '.container .inputArea .hotkeys-hrow',
                '.container .inputArea .short-text',
                '.container .inputArea .long-text',
                '.container .inputArea .numeric-text',
                '.container .inputArea .single-selection .single-selection-option',
                '.container .inputArea .multi-selection .multi-selection-option',
                '.container .inputArea .single-selection-dropdown',
                '.container .form-control',
                '.container .rating-symbol-foreground',
                '.container .thumbnail .caption'
            ].forEach(function (item) {
                var element = $(item);
                if (element) element.css({
                    'color': value.questionContentColor
                });
            });

            [
                '.container .inputArea .short-text input',
                '.container .inputArea .long-text textarea',
                '.container .inputArea .numeric-text input',
                '.container .inputArea .single-selection-dropdown select'
            ].forEach(function (item) {
                var element = $(item);
                if (element) element.css({
                    'color': value.inputFieldColor,
                    'background-color': value.inputFieldBackgroundColor
                });
            });

            [
                '.container .inputArea .active-option',
                '.container .form-control',
                '.container .inputArea .grid-selection .active-option',
                '.container .horizontal .liker-heading .heading.selected',
                '.container .horizontal .liker.render-button .active-option',
                '.container .alert-warning',
                '.container .alert-info',
                '.container .thumbnail.picture-option-active'
            ].forEach(function (item) {
                var element = $(item);
                if (element) element.css('border-color', value.questionContentColor);
            });

        }

        function updateBackgroundAttributes() {
            var container = $('.container');
            if (!container) {
                return;
            }

            var bgStyle = getBackgroundStyleName();
            if (bgStyle === 'repeat') {
                container.css('background-repeat', 'repeat');
                container.css('background-attachment', 'initial');
                container.css('background-size', 'auto');
            } else {
                container.css('background-repeat', 'no-repeat');
                container.css('background-attachment', 'fixed');
                container.css('background-size', bgStyle);
            }
        }

        function getBackgroundStyleName() {
            if (!value.backgroundStyle) {
                return value.isRepeatBackground ? "repeat" : "cover";
            }
            else {
                return value.backgroundStyle;
            }
        }

        function updateBackgroundColorAndOpacity() {
            var pageContainer = $('.data-container .data-content');
            if (pageContainer.length > 0) {
                pageContainer.css({
                    'opacity': value.pageContainerBackgroundOpacity,
                    'background-color': value.pageContainerBackgroundColor
                });
                return;
            }
            var fullScreenOverlay = $('#full-screen-overlay');
            if (fullScreenOverlay.length > 0) {
                fullScreenOverlay.css({
                    'opacity': value.pageContainerBackgroundOpacity,
                    'background-color': value.pageContainerBackgroundColor
                });
            }
        }

        function updatePageSetting() {
            var pageTitle = $('.page-title');
            if (pageTitle && value.pageTitle !== undefined) {
                pageTitle.html(value.pageTitle);
            }

            var pageDescription = $('.page-description');
            if (pageDescription && value.pageDescription !== undefined) {
                pageDescription.html(value.pageDescription);
            }
        }
    }
})();