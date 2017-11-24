(function () {
    angular.module('svt').factory('surveyEditorSvc', surveyEditorSvc);
    surveyEditorSvc.$inject = [
        'surveySvc', 'settingConst', '$compile',
        'arrayUtilSvc', 'numberUtilSvc', 'stringUtilSvc',
        'questionConst', 'guidUtilSvc', 'authSvc'
    ];

    function surveyEditorSvc(
        surveySvc, settingConst, $compile,
        arrayUtilSvc, numberUtilSvc, stringUtilSvc,
        questionConst, guidUtilSvc, authSvc) {

        var data = {
            survey: {},
            currentSurveyInfo: null,
            questionTitlesInSurvey: [], //Sample [{ id: 1, title: 'dummy' }]
            optionTitlesInSurvey: [], //Sample [{ id: 1, title: 'dummy' }]
            summarySkipCommandsInSurvey: [],
            totalQuestions: 0,
            questionEditorId: null,
            pageEditorId: null
        };
        var surveyEditMode = {
            value: false
        };

        var addMenuVisible = {
            value: false
        };

        var pageDefinitionKey = 'PageDefinition';
        var service = {
            setupClientSurveyFromApiSurvey: setupClientSurveyFromApiSurvey,
            refreshSummaryDataForSurvey: refreshSummaryDataForSurvey,
            refreshSummarySkipCommandsInSurvey: refreshSummarySkipCommandsInSurvey,
            getOrderPageIdsInSurvey: getOrderPageIdsInSurvey,
            setQuestionEditorId: setQuestionEditorId,
            setPageEditorId: setPageEditorId,
            getData: getData,
            getSurvey: getSurvey,
            setCurrentSurveyInfo: setCurrentSurveyInfo,
            getCurrentSurveyInfo: getCurrentSurveyInfo,
            getPages: getPages,
            addNewPageFromApi: addNewPageFromApi,
            getQuestionsWithOptions: getQuestionsWithOptions,
            getAllNoneInformationQuestionPositionsInSurvey: getAllNoneInformationQuestionPositionsInSurvey,
            getSurveyStatusDisplay: getSurveyStatusDisplay,
            getPicturePath: getPicturePath,
            resetMovingPageEvent: resetMovingPageEvent,
            buildMovingPage: buildMovingPage,
            resetToViewMode: resetToViewMode,
            setupQuestionPositionInSurvey: setupQuestionPositionInSurvey,
            setSurveyEditMode: setSurveyEditMode,
            getSurveyEditMode: getSurveyEditMode,
            setAddMenuVisible: setAddMenuVisible,
            getPermitRefreshSurvey: getPermitRefreshSurvey,
            pageFilterFn: pageFilterFn,
            generateNewPageTitle: generateNewPageTitle,
            generateQuestionAliasAuto: generateQuestionAliasAuto,
            getSvtPlaceholderItemsByQuestionId: getSvtPlaceholderItemsByQuestionId,
            getSvtPlaceholderRespondentItems: getSvtPlaceholderRespondentItems,
            getQuestions: getQuestions,
            setSurveyVersion: setSurveyVersion,
            setTopFolderVersion: setTopFolderVersion,
            hasAccessRights: hasAccessRights
        };
        return service;

        function setupClientSurveyFromApiSurvey(survey) {
            data.survey = angular.copy(survey);
            addExtraPropertiesForNeededObjects();
            refreshSummaryDataForSurvey();
            setupPageIdForAllQuestions();
            setupQuestionPositionInSurvey();
            return;

            function addExtraPropertiesForNeededObjects() {
                var pages = getPages();
                pages.forEach(function (page) {
                    page.skipCommands.forEach(function (skipCommand) {
                        skipCommand.clientId = guidUtilSvc.createGuid();
                        skipCommand.lastDataChanged = new Date();

                        skipCommand.expression.expressionItems.forEach(function (expressionItem) {
                            expressionItem.guid = guidUtilSvc.createGuid();
                        });
                    });

                    page.questionDefinitions.forEach(function (question) {
                        if (!question.questionMaskExpression) return;
                        question.questionMaskExpression.expressionItems.forEach(function (expressionItem) {
                            expressionItem.guid = guidUtilSvc.createGuid();
                        });
                    });
                });
            }
        }

        function refreshSummaryDataForSurvey() {
            // Need to refresh
            // - Question id - title array
            // - Option id - title array
            // - Summary skip command
            // - Total question in survey (except information question type)

            resetSummaryDataForSurvey();
            setupSummaryDataForSurvey();
            return;

            function resetSummaryDataForSurvey() {
                data.questionTitlesInSurvey.splice(0, data.questionTitlesInSurvey.length);
                data.optionTitlesInSurvey.splice(0, data.optionTitlesInSurvey.length);
                data.summarySkipCommandsInSurvey.splice(0, data.summarySkipCommandsInSurvey.length);
                data.totalQuestions = 0;
            }

            function setupSummaryDataForSurvey() {
                var pages = getPages(),
                    orderedPageIds = getOrderPageIdsInSurvey();
                pages.forEach(function (page) {
                    setupSummaryDataForSurveyByPage(page, orderedPageIds);
                    if (!page.questionDefinitions) return;
                    page.questionDefinitions.forEach(function (question) {
                        setupSummaryDataForSurveyByQuestion(question);
                    });
                });
            }

            function setupSummaryDataForSurveyByPage(page, orderedPageIds) {
                addSummarySkipCommandByPage(page, orderedPageIds);
            }

            function setupSummaryDataForSurveyByQuestion(question) {
                setupTotalQuestions();
                setupQuestionTitles();
                setupOptionTitles();
                return;

                function setupTotalQuestions() {
                    if (question.$type !== settingConst.questionTypes.InformationDefinition.value) {
                        data.totalQuestions++;
                    }
                }

                function setupQuestionTitles() {
                    data.questionTitlesInSurvey.push({
                        id: question.id,
                        title: question.title.items[0].text
                    });
                }

                function setupOptionTitles() {
                    //TODO did not process grid question type fully
                    if (!question.optionList || !question.optionList.options) return;
                    question.optionList.options.forEach(function (option) {
                        data.optionTitlesInSurvey.push({
                            id: option.id,
                            title: option.text.items[0].text
                        });
                    });
                }
            }
        }

        function addSummarySkipCommandByPage(page, orderedPageIds) {
            if (page.skipCommands.length === 0) return;
            var pageIndex = orderedPageIds.indexOf(page.id);
            for (var j = 0; j < page.skipCommands.length; j++) {
                data.summarySkipCommandsInSurvey.push({
                    pageId: page.id,
                    pageIndex: pageIndex,
                    skipToQuestionId: page.skipCommands[j].skipToQuestionId
                });
            }
        }

        function refreshSummarySkipCommandsInSurvey() {
            data.summarySkipCommandsInSurvey.splice(0, data.summarySkipCommandsInSurvey.length);
            var orderedPageIds = getOrderPageIdsInSurvey();
            var pages = getPages();
            for (var i = 0; i < pages.length; i++) {
                var page = pages[i];
                addSummarySkipCommandByPage(page, orderedPageIds);
            }
        }

        function getOrderPageIdsInSurvey() {
            return getPages().map(function (page) {
                return page.id;
            });
        }

        function setQuestionEditorId(id) {
            data.questionEditorId = id;
        }

        function setPageEditorId(pageId) {
            data.pageEditorId = pageId;
        }

        function getData() {
            return data;
        }

        function getSurvey() {
            return data.survey;
        }

        function setCurrentSurveyInfo(surveyInfo) {
            data.currentSurveyInfo = surveyInfo;
        }

        function getCurrentSurveyInfo() {
            return data.currentSurveyInfo;
        }

        function getPages() {
            var childNodes = data.survey.topFolder.childNodes;
            return childNodes.filter(pageFilterFn);
        }

        function pageFilterFn(node) {
            return node.$type === pageDefinitionKey;
        }

        function addNewPageFromApi(newPage, newPageIndex) {
            data.survey.topFolder.childNodes.splice(newPageIndex, 0, newPage);
        }

        function getQuestionsWithOptions() {
            var questionsWithOptions = [];

            var validQuestionTypes = [
                questionConst.questionTypes.singleSelection,
                questionConst.questionTypes.multipleSelection,
                questionConst.questionTypes.singleSelectionGrid,
                questionConst.questionTypes.multipleSelectionGrid,
                questionConst.questionTypes.shortTextList,
                questionConst.questionTypes.longTextList,
                questionConst.questionTypes.ratingGrid,
                questionConst.questionTypes.scaleGrid
            ];
            var pages = getPages();
            pages.forEach(function (p) {
                var questionsWithOptionsInPage = p.questionDefinitions.filter(function (q) {
                    return validQuestionTypes.indexOf(q.$type) > -1;
                });
                questionsWithOptions.push.apply(questionsWithOptions, questionsWithOptionsInPage);
            });

            return questionsWithOptions;
        }

        function getAllNoneInformationQuestionPositionsInSurvey() {
            var questionPositions = [];

            getPages().forEach(function (page) {
                page.questionDefinitions.forEach(function (question) {
                    if (question.$type !== settingConst.questionTypes.InformationDefinition.value) {
                        questionPositions.push(question.id);
                    }
                });
            });

            return questionPositions;
        }

        function destroySkipCommandEditorDirective(htmlContainerId, pageCtrlScope) {
            if (pageCtrlScope.$$childTail) {
                var scopeFromSkipActionEditorCtrl = pageCtrlScope.$$childTail;
                scopeFromSkipActionEditorCtrl.$destroy();
            }
            var skipCommandEditorHtml = $compile('')(pageCtrlScope);
            angular.element('#' + htmlContainerId).html(skipCommandEditorHtml);
        }

        function getSurveyStatusDisplay(status) {
            return ' (' + surveySvc.getStatusDisplay(status) + ')';
        }

        function getPicturePath() {
            return settingConst.surveyPictureBasePath + '/' + data.survey.id + '/';
        }

        function resetMovingPageEvent(event) {
            event.dest.sortableScope.removeItem(event.dest.index);
            event.source.itemScope.sortableScope.insertItem(event.source.index, event.source.itemScope.page);
        }

        function buildMovingPage(event) {
            var page = event.source.itemScope.page;
            return {
                pageId: page.id,
                surveyId: page.surveyId,
                newPageIndex: event.dest.index
            };
        }

        function resetToViewMode() {
            // What will this function do?
            // - Hide page editor (to modify page properties)
            // - Destroy all question creators (to create new question)
            // - Destroy all question editors (to edit existing question)
            // - Destroy all skip command creators and editors

            setPageEditorId(null);
            setQuestionEditorId(null);
            destroyAllQuestionCreators();
            destroyAllQuestionEditors();
            destroyAllSkipCommandCreatorsEditors();

            function destroyAllQuestionCreators() {
                var createQuestionTags = angular.element('create-question');
                if (!createQuestionTags || createQuestionTags.length === 0) return;

                for (var i = 0; i < createQuestionTags.length; i++) {
                    var htmlContainerId = createQuestionTags[i].getAttribute('html-container-id');
                    var htmlContainerScope = angular.element(createQuestionTags[i]).scope();
                    var createQuestionScope = angular.element(createQuestionTags[i]).children().first().scope();

                    createQuestionScope.$destroy();
                    var createQuestionHtml = $compile('')(htmlContainerScope);
                    angular.element('#' + htmlContainerId).html(createQuestionHtml);
                }
            }

            function destroyAllQuestionEditors() {
                var editQuestionTags = angular.element('edit-question');
                if (!arrayUtilSvc.isArrayHasElement(editQuestionTags)) return;

                for (var i = 0; i < editQuestionTags.length; i++) {
                    var htmlContainerId = editQuestionTags[i].getAttribute('html-container-id');
                    var htmlContainerScope = angular.element(editQuestionTags[i]).scope();
                    var editQuestionScope = angular.element(editQuestionTags[i]).children().first().scope();

                    var editQuestionHtml = $compile('<div id="' + htmlContainerId + '"></div>')(htmlContainerScope);
                    angular.element('#' + htmlContainerId).replaceWith(editQuestionHtml);
                    editQuestionScope.$destroy();
                }
            }

            function destroyAllSkipCommandCreatorsEditors() {
                var skipCommandTags = angular.element('skip-command-editor');
                if (!arrayUtilSvc.isArrayHasElement(skipCommandTags)) return;

                var htmlContainerId;
                for (var i = 0; i < skipCommandTags.length; i++) {
                    htmlContainerId = skipCommandTags[i].getAttribute('html-container-id');
                    destroySkipCommandEditorDirective(htmlContainerId, angular.element(skipCommandTags[i]).scope());
                }
            }
        }

        function setupPageIdForAllQuestions() {
            getPages().forEach(function (page) {
                page.questionDefinitions.forEach(function (question) {
                    question.pageId = page.id;
                });
            });
        }

        function setupQuestionPositionInSurvey() {
            var position = 0,
                infoPosition = 0;

            getPages().forEach(function (page) {
                page.questionDefinitions.forEach(function (question) {
                    if (question.$type === settingConst.questionTypes.InformationDefinition.value) {
                        question.positionInSurvey = numberUtilSvc.convertIntegerToAlphabet(infoPosition++);
                    } else {
                        question.positionInSurvey = ++position;
                    }
                });
            });
        }

        function setSurveyEditMode(isUsingEditMode) {
            surveyEditMode.value = isUsingEditMode;
        }

        function getSurveyEditMode() {
            return surveyEditMode;
        }

        function setAddMenuVisible(isAddMenuVisible) {
            addMenuVisible.value = isAddMenuVisible;
        }

        function getPermitRefreshSurvey() {
            return !surveyEditMode.value && !addMenuVisible.value;
        }

        function generateNewPageTitle() {
            var titles = getPages().map(function (page) {
                return stringUtilSvc.getPlainText(
                    page.title && page.title.items ? page.title.items[0].text : '');
            });
            var max = 0;
            titles.forEach(function (title) {
                if (!/^page \d+$/i.test(title)) return;
                var value = parseInt(title.replace(/^page /i, ''));
                if (value > max) max = value;
            });
            max++;
            return 'Page ' + max;
        }

        function generateQuestionAliasAuto() {
            var pages = service.getSurvey().topFolder.childNodes || [];
            var aliasList = [];
            pages.forEach(function (page) {
                if (page.questionDefinitions) {
                    page.questionDefinitions.forEach(function (question) {
                        aliasList.push(question.alias.toLowerCase());
                    });
                }
            });
            return generateQuestionAlias();

            function generateQuestionAlias() {
                if (!Array.isArray(aliasList)) return null;
                var preAlias = 'q';
                var token = aliasList.length;
                var alias = preAlias + token;
                checkAlias();
                return alias;

                function checkAlias() {
                    if (aliasList.indexOf(alias) >= 0) {
                        token += 1;
                        alias = preAlias + token;
                        checkAlias();
                    }
                }
            }
        }

        function getSvtPlaceholderRespondentItems() {
            var customColumn = typeof data.currentSurveyInfo === 'object' && data.currentSurveyInfo !== null ?
                data.currentSurveyInfo.customColumns :
                null;
            if (customColumn === null) return [];

            var svtPlaceHolderItems = [];
            var items = customColumn.split(',') || [];
            for (var i = 0; i < items.length; i++) {
                svtPlaceHolderItems.push(buildSvtPlaceholderItemByRespondent(items[i]));
            }
            return svtPlaceHolderItems;

            function buildSvtPlaceholderItemByRespondent(columnName) {
                var svtPlaceHolderItem = [];
                var maxCharacters = 30;
                var appendText = '...';
                var valuePrefix = 'respondents.';
                var heading = stringUtilSvc.getPlainText(columnName);
                var itemValue = valuePrefix + columnName;
                var itemHeading = stringUtilSvc.truncateByCharAmount(heading, maxCharacters, appendText);

                svtPlaceHolderItem.push(itemHeading);
                svtPlaceHolderItem.push(itemValue);

                return svtPlaceHolderItem;
            }
        }

        function getSvtPlaceholderItemsByQuestionId(questionId) {
            var svtPlaceHolderItems = [];
            var pages = getPages();

            for (var pageIndex = 0; pageIndex < pages.length; pageIndex++) {
                var currentPage = pages[pageIndex];

                for (var questionIndex = 0; questionIndex < currentPage.questionDefinitions.length; questionIndex++) {
                    var currentQuestion = currentPage.questionDefinitions[questionIndex];

                    if (currentQuestion.$type === questionConst.questionTypes.information ||
                        currentQuestion.id === 0 ||
                        currentQuestion.id === questionId) continue;

                    svtPlaceHolderItems.push(buildSvtPlaceholderItemByQuestion(currentQuestion));
                }
            }

            return svtPlaceHolderItems;

            function buildSvtPlaceholderItemByQuestion(processingQuestion) {
                var svtPlaceHolderItem = [];
                var maxCharacters = 30;
                var appendText = '...';
                var valuePrefix = 'questions.';
                var questionHeading = stringUtilSvc.getPlainText(processingQuestion.title.items[0].text);

                var itemValue = valuePrefix + processingQuestion.alias;
                var itemHeading = stringUtilSvc.truncateByCharAmount(questionHeading, maxCharacters, appendText) + ' ( ' + processingQuestion.alias + ' )';

                svtPlaceHolderItem.push(itemHeading);
                svtPlaceHolderItem.push(itemValue);

                return svtPlaceHolderItem;
            }
        }

        function getQuestions() {
            var questions = [];

            var pages = getPages();
            pages.forEach(function (p) {
                questions = questions.concat(p.questionDefinitions);
            });

            return questions;
        }

        function setSurveyVersion(version) {
            data.survey.version = version;
        }

        function setTopFolderVersion(version) {
            data.survey.topFolder.version = version;
        }

        function hasAccessRights(user) {
            var surveyUserId = data.survey.userId;
            var loginData = authSvc.getLoginData();
            var fullAccessRights = (data.survey.accessRights && angular.copy(data.survey.accessRights.full)) || [];

            var hasFullAccessRights = fullAccessRights.some(function (item) { return item === loginData.externalId; });
            var hasOwnerAccessRights = loginData.externalId === surveyUserId;
            var hasCompanyId = user.companyId ? true : false;

            return hasCompanyId && (hasFullAccessRights || hasOwnerAccessRights);
        }
    }
})();