(function () {
    angular
        .module('svt')
        .service('pageSvc', pageSvc);

    pageSvc.$inject = [
        'pageDataSvc', '$compile', 'arrayUtilSvc', 'languageStringUtilSvc'
    ];

    function pageSvc(
        pageDataSvc, $compile, arrayUtilSvc, languageStringUtilSvc) {
        var generalConstant = {
            NOT_FOUND: -1
        };
        var skipCommandEditor = { id: null };
        var currentPages = [],
            activePage = { pageId: null },
            collapsedPageIds = [],
            collapsedQuestionIds = [];

        var service = {
            getNavigationButtonSettings: getNavigationButtonSettings,
            getQuestionOrders: getQuestionOrders,
            handleCreateQuestion: handleCreateQuestion,
            handleEditQuestion: handleEditQuestion,
            setCurrentPages: setCurrentPages,
            getCurrentPages: getCurrentPages,
            getActivePage: getActivePage,
            setActivePage: setActivePage,
            getCollapsedPageIds: getCollapsedPageIds,
            getCollapsedQuestionIds: getCollapsedQuestionIds,
            findPageIndexById: findPageIndexById,
            handleCreateSkipCommand: handleCreateSkipCommand,
            handleUpdateSkipCommand: handleUpdateSkipCommand,
            getSkipCommandEditor: getSkipCommandEditor,
            setSkipCommandEditorId: setSkipCommandEditorId,
            getPageById: getPageById,
            setRowVersionOnPages: setRowVersionOnPages,
            getPageByCondition: getPageByCondition,
            buildPage: buildPage
        };

        return service;

        function getNavigationButtonSettings() {
            return [
                { code: 0, name: 'Default' },
                { code: 1, name: 'ForwardOnly' },
                { code: 2, name: 'None' }
            ];
        }

        function getQuestionOrders() {
            return [
                { code: 0, name: 'In Order' },
                { code: 1, name: 'Randomized' },
                { code: 2, name: 'Flipped' },
                { code: 3, name: 'Rotated' }
            ];
        }

        function handleCreateQuestion($scope, questionType, selectedQuestion, page, isAboveSelectedQuestion, questionIndex) {
            buildCreateQuestionDirective();
            setActivePage(null);
            setSkipCommandEditorId(null);
            return;

            function buildCreateQuestionDirective() {
                var htmlContainerId = parseHtmlContainerId();
                var html = '<create-question html-container-id="' + htmlContainerId + '" page-id="' + page.id + '" question-type="' + questionType + '" index="' + questionIndex + '"></create-question>';

                var createQuestionHtml = $compile(html)($scope);
                angular.element('#' + htmlContainerId).html(createQuestionHtml);
            }

            function parseHtmlContainerId() {
                var htmlPartId = 'create-question-container-';
                if (!selectedQuestion) return htmlPartId + page.id;
                if (isAboveSelectedQuestion) return htmlPartId + selectedQuestion.id;

                var id = '';
                for (var k = 0; k < page.questionDefinitions.length; k++) {
                    var question = page.questionDefinitions[k];
                    if (question.id === selectedQuestion.id) {
                        id = k === page.questionDefinitions.length - 1 ?
                            page.id :
                            page.questionDefinitions[k + 1].id;
                        break;
                    }
                }
                return htmlPartId + id;
            }
        }

        function handleEditQuestion(question, pageId, $scope) {
            buildEditQuestionDirective();
            setActivePage(null);
            setSkipCommandEditorId(null);

            function buildEditQuestionDirective() {
                var scope = $scope.$new();
                var hideAdvanceSetting = $scope.pageCtrl.isThankYouPage;
                scope.question = question;
                var htmlContainerId = 'edit-question-container-' + String(question.id),
                    html = '<edit-question hide-advance-setting="{{' + hideAdvanceSetting + '}}" html-container-id="' + htmlContainerId + '" id="' + htmlContainerId + '" question="question" page-id="' + pageId +'"></edit-question>',
                    editQuestionHtml = $compile(html)(scope);
                angular.element('#' + htmlContainerId).replaceWith(editQuestionHtml);
            }
        }

        function buildPage(surveyId, parentId) {
            return {
                id: null,
                alias: '',
                title: languageStringUtilSvc.buildLanguageString(surveyId, 'Untitled'),
                description: languageStringUtilSvc.buildLanguageString(surveyId),
                surveyId: surveyId,
                parentId: parentId,
                collapse: false
            };
        }

        function setCurrentPages(pages) {
            currentPages = pages;
            pages.forEach(setLanguageStrings);
        }

        function setLanguageStrings(page) {
            if (!page.title) page.title = languageStringUtilSvc.buildLanguageString(page.surveyId);
            if (!page.description) page.description = languageStringUtilSvc.buildLanguageString(page.surveyId);
        }

        function getCurrentPages() {
            return currentPages;
        }

        function setActivePage(pageId) {
            activePage.pageId = pageId;
        }

        function getActivePage() {
            return activePage;
        }

        function getCollapsedPageIds() {
            return collapsedPageIds;
        }

        function getCollapsedQuestionIds() {
            return collapsedQuestionIds;
        }

        function findPageIndexById(array, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].id === value) {
                    return i;
                }
            }
            return generalConstant.NOT_FOUND;
        }

        function handleCreateSkipCommand(blockId, pageId, $scope) {
            buildSkipCommandEditorForCreating();
            setActivePage(null);
            setSkipCommandEditorId(null);
            return;

            function buildSkipCommandEditorForCreating() {
                var htmlContainerId = 'create-skip-command-container-' + String(pageId),
                    html = '<skip-command-editor html-container-id="' + htmlContainerId + '" block-id="'+ blockId +'" page-id="' + pageId + '"></skip-command-editor>',
                    skipCommandEditorHtml = $compile(html)($scope);
                angular.element('#' + htmlContainerId).html(skipCommandEditorHtml);
            }
        }

        function handleUpdateSkipCommand(blockId, pageId, skipCommand, $scope) {
            buildSkipCommandEditorForEditing();
            setActivePage(null);
            setSkipCommandEditorId(skipCommand.clientId);
            return;

            function buildSkipCommandEditorForEditing() {
                var scope = $scope.$new();
                scope.skipCommand = skipCommand;
                var htmlContainerId = 'edit-skip-command-container-' + String(skipCommand.clientId),
                    html = '<skip-command-editor html-container-id="' + htmlContainerId + '" id="' + htmlContainerId + '" skip-command="skipCommand" block-id="'+ blockId +'" page-id="' + pageId + '"></skip-command-editor>',
                    skipCommandEditorHtml = $compile(html)(scope);
                angular.element('#' + htmlContainerId).replaceWith(skipCommandEditorHtml);
            }
        }

        function setSkipCommandEditorId(skipCommandId) {
            skipCommandEditor.id = skipCommandId;
        }

        function getSkipCommandEditor() {
            return skipCommandEditor;
        }

        function getPageById(pageId, pages) {
            if (!pageId || !pages || !Array.isArray(pages)) return null;
            return arrayUtilSvc.getItem(pages, function (page) {
                if (page.id === pageId) return page;
            });
        }

        function setRowVersionOnPages(pages, rowVersionOfPages) {
            pages.forEach(function (page) {
                var rowVersionOfPage = getPageByCondition(rowVersionOfPages, { name: 'PageId', value: page.id });
                if (rowVersionOfPage) {
                    page.rowVersion = rowVersionOfPage.rowVersion;
                }
            });
        }

        function getPageByCondition(pages, condition) {
            if (!pages || !condition) return null;
            if (!condition.name || condition.value === undefined) return null;

            for (var i = 0; i < pages.length; i++) {
                if (pages[i][condition.name] === condition.value) return angular.copy(pages[i]);
            }
            return null;
        }
    }
})();