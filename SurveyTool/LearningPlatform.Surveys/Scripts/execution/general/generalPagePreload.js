var GeneralPagePreload = (function () {

    return {
        setUpPreLoadDataTable: setUpPreLoadDataTable,
        setupCurrentPageRecord: setupCurrentPageRecord,
        loadAndStoreNextPage: loadAndStoreNextPage,
        loadAndStorePreviousPage: loadAndStorePreviousPage,
        getPreloadPagesDataTable: getPreloadPagesDataTable,
        handleStorageLoadedPage: handleStorageLoadedPage,
        storePreviousPageIdToDataTable: storePreviousPageIdToDataTable,
        stogePageToSession: stogePageToSession,
        stogeCurrentFormToSession: stogeCurrentFormToSession,
        getPreloadPage: getPreloadPage,
        updateStoredFormValues: updateStoredFormValues,
        handlePreloadPages: handlePreloadPages
    };

    function setUpPreLoadDataTable() {
        sessionStorage.clear();
        sessionStorage.pagesDataTable = '{}';
    }

    function setupCurrentPageRecord(currentPageId) {
        var pagesDataTable = JSON.parse(sessionStorage.pagesDataTable);
        pagesDataTable[currentPageId] = {};
        sessionStorage.pagesDataTable = JSON.stringify(pagesDataTable);
    }

    function loadAndStoreNextPage() {
        var currentId = GeneralPageMobile.getHiddenValue('$pageId', document);
        var pagesDataTable = getPreloadPagesDataTable();
        if (getPreloadPage(pagesDataTable[currentId].nextPageId)) return;

        var url = window.location.origin + window.location.pathname + '/peek-next-page';
        $.ajax({
            type: "POST",
            url: url,
            data: $("form").serialize(),
            success: function (pageContent) {
                handleStorageLoadedPage(pageContent, 'next');
            },
            error: function () {
                console.log('Loading page is failed');
            }
        });
    }

    function loadAndStorePreviousPage() {
        var currentId = GeneralPageMobile.getHiddenValue('$pageId', document);
        var pagesDataTable = getPreloadPagesDataTable();
        if (!pagesDataTable) return;

        if (getPreloadPage(pagesDataTable[currentId].previousPageId)) return;

        var url = window.location.origin + window.location.pathname + '/peek-previous-page';
        $.ajax({
            type: "POST",
            url: url,
            data: $("form").serialize(),
            success: function (pageContent) {
                handleStorageLoadedPage(pageContent, 'previous');
            },
            error: function () {
                console.log('Loading page is failed');
            }
        });
    }

    function handleStorageLoadedPage(pageContent, direction) {
        var pageContentObject = $.parseHTML(pageContent);

        var pageId = GeneralPageMobile.getHiddenValue('$pageId', pageContentObject);
        var isDynamicPage = GeneralPageMobile.isDynamicPage(pageContentObject);
        if (isDynamicPage) {
            pageId = '';
        }

        var pagesDataTable = JSON.parse(sessionStorage.pagesDataTable);
        var currentId = GeneralPageMobile.getHiddenValue('$pageId', document);
        if (!pagesDataTable[currentId]) {
            pagesDataTable[currentId] = {};
            sessionStorage.pagesDataTable = JSON.stringify(pagesDataTable);
        }

        if (direction === 'next') {
            storeNextPageIdToDataTable(pageId);
        } else if (direction === 'current') {
            storeCurrentDataToDataTable(!isDynamicPage);
        } else if (direction === 'previous') {
            storePreviousPageIdToDataTable(pageId);
        }

        if (!isDynamicPage) {
            stogePageToSession(pageId, pageContent);
        }
    }

    function storeNextPageIdToDataTable(nextPageId) {
        var currentId = GeneralPageMobile.getHiddenValue('$pageId', document);
        var pagesDataTable = getPreloadPagesDataTable();
        if (!pagesDataTable) return;

        pagesDataTable[currentId].nextPageId = nextPageId;
        sessionStorage.pagesDataTable = JSON.stringify(pagesDataTable);
    }

    function storePreviousPageIdToDataTable(previousPageId) {
        var currentId = GeneralPageMobile.getHiddenValue('$pageId', document);
        var pagesDataTable = getPreloadPagesDataTable();
        if (!pagesDataTable) return;

        pagesDataTable[currentId].previousPageId = previousPageId;
        sessionStorage.pagesDataTable = JSON.stringify(pagesDataTable);
    }

    function storeCurrentDataToDataTable(isExistData) {
        var currentId = GeneralPageMobile.getHiddenValue('$pageId', document);
        var pagesDataTable = getPreloadPagesDataTable();
        if (!pagesDataTable) return;

        pagesDataTable[currentId].isExistData = isExistData;
        sessionStorage.pagesDataTable = JSON.stringify(pagesDataTable);
    }

    function getPreloadPagesDataTable() {
        if (sessionStorage.pagesDataTable) {
            return JSON.parse(sessionStorage.pagesDataTable);
        } else {
            return false;
        }
    }

    function stogePageToSession(pageId, data) {
        data = data.replace('class="show"', '');
        data = data.replace(
            'id="one-question-container" style="visibility: visible',
            'id="one-question-container" style="visibility: hidden'
        );

        sessionStorage['page-' + pageId] = data;
    }

    function stogeCurrentFormToSession(pageId) {
        sessionStorage['form-' + pageId] = JSON.stringify($('form').serializeArray());
    }

    function getPreloadPage(pageId) {
        return sessionStorage['page-' + pageId];
    }

    function updateStoredFormValues(element) {
        var formDatas = document.getElementsByTagName('form')[0].elements;

        if (element.name.indexOf('OtherQuestion') !== -1) {
            $.each(formDatas, function (index, formData) {
                if (formData.name.indexOf('OtherQuestion') !== -1 && formData.name === element.name) {
                    formDatas[index].value = element.value;
                }
            });
        } else {
            var question = [];
            $('.question-settings').each(function (index, questionElement) {
                $(questionElement).find('input, textarea').each(function (ind, field) {
                    if ($(field).attr('id') === element.name || $(field).attr('name') === element.name ) {
                        question = window.questions.filter(function (item) {
                            return item.alias === $(questionElement).attr('question-alias');
                        });
                    }
                });
            });

            if (!question[0]) return;

            switch (question[0].questionType) {
                case QUESTION_TYPES.information:
                case QUESTION_TYPES.rating:
                case QUESTION_TYPES.ratingGrid:
                    break;
                case QUESTION_TYPES.scale:
                case QUESTION_TYPES.scaleGrid:
                    $.each(formDatas, function (index, formData) {
                        var elementNameCombine = element.name + '_' + element.value;
                        if (formData.name === element.name && formData.id === elementNameCombine) {
                            formDatas[index].checked = true;
                        }
                    });
                    break;
                case QUESTION_TYPES.shortText:
                case QUESTION_TYPES.longText:
                case QUESTION_TYPES.shortTextList:
                case QUESTION_TYPES.longTextList:
                case QUESTION_TYPES.numeric:
                case QUESTION_TYPES.date:
                    $.each(formDatas, function (index, formData) {
                        if (formData.name === element.name) {
                            formDatas[index].value = element.value;
                        }
                    });

                    break;
                case QUESTION_TYPES.singleSelection:
                case QUESTION_TYPES.singleSelectionGrid:
                case QUESTION_TYPES.netPromoterScore:
                case QUESTION_TYPES.pictureSingleSelection:
                    $.each(formDatas, function (index, formData) {
                        if (formData.name === element.name && formData.value === element.value) {
                            formData.checked = true;
                        }
                    });

                    break;
                case QUESTION_TYPES.multipleSelection:
                case QUESTION_TYPES.multipleSelectionGrid:
                case QUESTION_TYPES.pictureMultipleSelection:
                    $.each(formDatas, function (index, formData) {
                        if (formData.id === element.name) {
                            formData.checked = element.value === 'true';
                        }
                    });

                    break;
                default:
                    break;
            }
        }
    }

    function handlePreloadPages() {
        var pagesDataTable = getPreloadPagesDataTable();
        if (!pagesDataTable) return;

        var currentPageId = GeneralPageMobile.getHiddenValue('$pageId', $('html')[0].outerHTML);

        if (!pagesDataTable[currentPageId]) {
            GeneralPagePreload.setupCurrentPageRecord(currentPageId);
        }

        if (sessionStorage.previousPageId && sessionStorage.previousPageId !== '') {
            GeneralPagePreload.storePreviousPageIdToDataTable(sessionStorage.previousPageId);
        }

        if (!GeneralPage.isLastPage('.page-navigation') &&
            !GeneralPageMobile.hasSkipAction(document) &&
            !GeneralPage.isThankYouPage()) {
            GeneralPagePreload.loadAndStoreNextPage();
        }

        if (GeneralPageMobile.isPreviousPageAvailable('.page-navigation')) {
            GeneralPagePreload.loadAndStorePreviousPage();
        }

        GeneralPagePreload.handleStorageLoadedPage($('html')[0].outerHTML, 'current');

        // Update form values for preload page
        if (sessionStorage['form-' + currentPageId]) {
            var storedFormDatas = [];
            $.each(JSON.parse(sessionStorage['form-' + currentPageId]), function (ind, storedFormData) {
                var isDublicate = storedFormDatas.some(function (item) {
                    return item.name === storedFormData.name;
                });

                if (isDublicate) return;
                storedFormDatas.push(storedFormData);
            });

            var unuseElement = ["context", "$questionPercent", "$pageId", "$isDynamicPage", "$hasSkipActions"];
            $.each(storedFormDatas, function (index, element) {
                if (unuseElement.indexOf(element.name) === -1) {
                    GeneralPagePreload.updateStoredFormValues(element);
                }
            });
        }

    }

})();
