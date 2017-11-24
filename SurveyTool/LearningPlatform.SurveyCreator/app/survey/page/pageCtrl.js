(function () {
    angular
        .module('svt')
        .controller('pageCtrl', pageCtrl);

    pageCtrl.$inject = [
        '$scope', '$route', '$modal', 'stringUtilSvc',
        'pageSvc', 'pageValidationSvc', 'pageDataSvc', 'questionSvc',
        'questionTypeSvc', 'questionDataSvc', 'spinnerUtilSvc', 'errorHandlingSvc',
        'surveyEditorSvc', 'surveyEditorPageSvc', 'surveyEditorQuestionSvc',
        'httpStatusCode',
        'surveyEditorValidationSvc', 'questionCarryOverSvc', 'indexSvc', 'questionConst', 'serverValidationSvc',
        'surveyContentValidation', 'moveQuestionSvc', 'movePageSvc', 'fromLibraryDataSvc',
        'libraryDataSvc'
    ];

    function pageCtrl(
        $scope, $route, $modal, stringUtilSvc,
        pageSvc, pageValidationSvc, pageDataSvc, questionSvc,
        questionTypeSvc, questionDataSvc, spinnerUtilSvc, errorHandlingSvc,
        surveyEditorSvc, surveyEditorPageSvc, surveyEditorQuestionSvc,
        httpStatusCode,
        surveyEditorValidationSvc, questionCarryOverSvc, indexSvc, questionConst, serverValidationSvc,
        surveyContentValidation, moveQuestionSvc, movePageSvc, fromLibraryDataSvc,
        libraryDataSvc
        ) {
        /* jshint -W040 */

        var skipCommandQuestionTypeConst = 'SkipCommand';
        var vm = this;

        vm.questionTypes = questionConst.questionTypes;
        vm.appendValue = '...';
        vm.truncateNumberOfWord = 7;
        vm.isHightlightPage = false;
        vm.topFolder = surveyEditorSvc.getSurvey().topFolder; //TODO when we have multiple blocks, we can get block (folder) by id
        vm.pages = surveyEditorSvc.getSurvey().topFolder.childNodes; //TODO consider removing this property, replace by vm.topFolder.childNodes
        vm.currentPage = $scope.pageObj;
        vm.activePage = pageSvc.getActivePage();
        vm.activeQuestion = questionSvc.getActiveQuestion();
        vm.collapsedPageIds = pageSvc.getCollapsedPageIds();
        vm.collapsedQuestionIds = pageSvc.getCollapsedQuestionIds();
        vm.generalConstant = {
            MIN_TOTAL_PAGE: 2,
            MIN_TOTAL_QUESTION_IN_PAGE: 0
        };
        vm.page = angular.copy(vm.currentPage);
        vm.navigationButtonSettings = pageSvc.getNavigationButtonSettings();
        vm.questionOrders = pageSvc.getQuestionOrders();
        vm.isThankYouPage = surveyEditorPageSvc.isThankYouPage(vm.currentPage);
        vm.noneInformationQuestionPositionsInSurvey = surveyEditorSvc.getAllNoneInformationQuestionPositionsInSurvey();

        vm.sortableOptionsQuestion = {
            itemMoved: function (event) {
                moveQuestion(event);
            },
            orderChanged: function (event) {
                moveQuestion(event);
            },
            containment: 'body',
            accept: function (sourceItemHandleScope) {
                surveyEditorSvc.resetToViewMode();
                return (sourceItemHandleScope.itemScope.question && !sourceItemHandleScope.itemScope.answer) ? true : false;
            },
            dragStart: function () {
                surveyEditorSvc.setSurveyEditMode(true);
            },
            dragEnd: function () {
                surveyEditorSvc.setSurveyEditMode(false);
            }
        };
        vm.surveyEditorData = surveyEditorSvc.getData();
        vm.skipCommandEditor = pageSvc.getSkipCommandEditor();

        vm.getReadyToImportFromLibrary = getReadyToImportFromLibrary;
        vm.getReadyToCreateQuestion = getReadyToCreateQuestion;
        vm.truncateQuestionTitle = truncateQuestionTitle;
        vm.getReadyToEditQuestion = getReadyToEditQuestion;
        vm.getReadyToEditPage = getReadyToEditPage;
        vm.onDeletePage = onDeletePage;
        vm.showPreviewDialog = showPreviewDialog;
        vm.removeQuestion = removeQuestion;
        vm.toggleCollapsePage = toggleCollapsePage;
        vm.toggleCollapseQuestion = toggleCollapseQuestion;
        vm.getQuestionType = getQuestionType;
        vm.duplicateQuestion = duplicateQuestion;

        vm.clickMarkedQuestion = clickMarkedQuestion;
        vm.getReadyToCreateSkipAction = getReadyToCreateSkipAction;
        vm.getReadyToEditSkipAction = getReadyToEditSkipAction;
        vm.removeSkipAction = removeSkipAction;
        vm.movePageUp = movePageUp;
        vm.movePageDown = movePageDown;
        vm.moveQuestionUp = moveQuestionUp;
        vm.moveQuestionDown = moveQuestionDown;

        vm.selectPageByStep = selectPageByStep;
        vm.selectQuestionByStep = selectQuestionByStep;
        vm.canClickToMovePageUp = canClickToMovePageUp;
        vm.canClickToMovePageDown = canClickToMovePageDown;
        vm.canClickToDeletePage = canClickToDeletePage;
        vm.canClickToMoveQuestion = canClickToMoveQuestion;
        vm.isSelectingQuestion = isSelectingQuestion;
        vm.canClickToMoveQuestionUp = canClickToMoveQuestionUp;
        vm.canClickToMoveQuestionDown = canClickToMoveQuestionDown;
        vm.getPageContainerClasses = getPageContainerClasses;
        vm.getQuestionContainerClasses = getQuestionContainerClasses;
        vm.getQuestionViewClass = getQuestionViewClass;
        vm.getQuestionContentClasses = getQuestionContentClasses;
        vm.getSkipCommandContainerClasses = getSkipCommandContainerClasses;
        vm.getSkipCommandContentClasses = getSkipCommandContentClasses;
        vm.isEditingQuestion = isEditingQuestion;
        vm.isEditingSkipAction = isEditingSkipAction;
        vm.isCollapsedQuestion = isCollapsedQuestion;
        vm.isShowUpQuestionOverlay = false;
        vm.isRequiredQuestion = isRequiredQuestion;
        vm.createAboveQuestion = createAboveQuestion;
        vm.createBelowQuestion = createBelowQuestion;
        vm.onBreakPage = onBreakPage;
        vm.collapseQuestions = collapseQuestions;
        vm.expandQuestions = expandQuestions;
        vm.addQuestionToLibrary = addQuestionToLibrary;
        vm.addPageToLibrary = addPageToLibrary;

        vm.isCollapsedAllPage = $scope.isCollapsedAllPage;
        vm.isShowQuestionMovingIcon = isShowQuestionMovingIcon;
        vm.isShowInsertPageBreak = isShowInsertPageBreak;

        vm.init = init;

        init();

        function init() {
            vm.questionsInPage = surveyEditorPageSvc.getQuestionsByPageId(vm.currentPage.id);
            vm.skipCommands = vm.currentPage.skipCommands;
            vm.summarySkipCommandsInSurvey = vm.surveyEditorData.summarySkipCommandsInSurvey;
            addExtraPropertiesForQuestionMaskExpressionInQuestions();
            vm.isCollapsedPage = vm.isSelectedPage = vm.isEditingPage = false;
            setupWatchCollapsedPage();
            setupWatchSelectedPage();
            setupWatchEditingPage();
            return;

            function addExtraPropertiesForQuestionMaskExpressionInQuestions() {
                for (var i = 0; i < vm.questionsInPage.length; i++) {
                    if (vm.questionsInPage[i].questionMaskExpression !== null) {
                        vm.questionsInPage[i].questionMaskExpression.lastRelatedDataChanged = new Date();
                    }
                }
            }

            function setupWatchCollapsedPage() {
                $scope.$watch(function () {
                    return vm.collapsedPageIds;
                }, function (newCollapsedPageIds) {
                    if (!newCollapsedPageIds) return;
                    vm.isCollapsedPage = newCollapsedPageIds.indexOf(vm.currentPage.id) >= 0 ? true : false;
                }, true);
            }

            function setupWatchSelectedPage() {
                $scope.$watch(function () {
                    return vm.activePage.pageId;
                }, function (newPageId) {
                    vm.isSelectedPage = vm.currentPage.id === newPageId;
                });
            }

            function setupWatchEditingPage() {
                $scope.$watch(function () {
                    return vm.surveyEditorData.pageEditorId;
                }, function (newPageId) {
                    vm.isEditingPage = vm.currentPage.id === newPageId;
                });
            }
        }

        function moveQuestion(event) {
            surveyEditorSvc.resetToViewMode();
            var destinationPageId = event.dest.sortableScope.$parent.pageCtrl.currentPage.id;
            var destinationPageVersion = event.dest.sortableScope.$parent.pageCtrl.currentPage.version;
            var movingQuestion = event.source.itemScope.question;
            if (!pageValidationSvc.validateMovingQuestions(event, vm.noneInformationQuestionPositionsInSurvey)) {
                $route.reload();
                return;
            }

            var newIndexPosition = event.dest.index,
                oldIndexPosition = event.source.index;
            updateQuestionByMoving(movingQuestion, destinationPageId, destinationPageVersion, oldIndexPosition, newIndexPosition);
            pageSvc.setActivePage(null);
            questionSvc.setActiveQuestion(movingQuestion.id);
            return;
        }

        function createAboveQuestion(selectedQuestion) {
            var newQuestionIndex = vm.currentPage.questionDefinitions.length;
            for (var i = 0; i < vm.currentPage.questionDefinitions.length; i++) {
                if (vm.currentPage.questionDefinitions[i].id === selectedQuestion.id) {
                    newQuestionIndex = i;
                    break;
                }
            }
            createQuestion(vm.questionTypes.singleSelection, selectedQuestion, vm.currentPage, true, newQuestionIndex);
        }

        function createBelowQuestion(selectedQuestion) {
            var newQuestionIndex = vm.currentPage.questionDefinitions.length;
            for (var i = 0; i < vm.currentPage.questionDefinitions.length; i++) {
                if (vm.currentPage.questionDefinitions[i].id === selectedQuestion.id) {
                    newQuestionIndex = (i + 1);
                    break;
                }
            }
            createQuestion(vm.questionTypes.singleSelection, selectedQuestion, vm.currentPage, false, newQuestionIndex);
        }

        function getReadyToImportFromLibrary(event, page) {
            event.stopPropagation();

            $modal.open({
                templateUrl: 'survey/surveyLibrary/fromLibrary/from-library-dialog.html',
                controller: 'fromLibraryDialogCtrl',
                size: 'md',
                windowClass: 'from-library-modal-window',
                backdrop: 'static',
                resolve: {
                    modalData: function () {
                        return {
                            modalTitle: 'Add from Library',
                            okTitle: 'Add',
                            cancelTitle: 'Cancel'
                        };
                    }
                }
            }).result.then(function (result) {
                if (!result.data) return;

                if (result.data.isImportedPage) {
                    importLibraryPageIntoSurvey(result.data, page);
                } else {
                    importLibraryQuestionsIntoPage(result.data, page);
                }
            });
        }

        function importLibraryPageIntoSurvey(data, page) {
            var libraryPageParameter = {
                folderId: vm.topFolder.id,
                folderVersion: vm.topFolder.version,
                surveyId: page.surveyId,
                sourcePageIds: data.selectedPageIds,
                libraryId: data.libraryId,
                duplicatePoint: $scope.index + 1
            };

            spinnerUtilSvc.showSpinner();
            fromLibraryDataSvc.importLibraryPages(libraryPageParameter).$promise.then(function (response) {
                surveyEditorSvc.setSurveyVersion(response.headers['survey-etag']);
                surveyEditorSvc.setTopFolderVersion(response.headers.etag);

                var newPages = JSON.parse(response.data);
                var point = libraryPageParameter.duplicatePoint;
                newPages.forEach(function (newPage) {
                    newPage.questionDefinitions.forEach(function (question) {
                        question.pageId = newPage.id;
                    });

                    surveyEditorSvc.addNewPageFromApi(newPage, point++);
                });
                pageSvc.setCurrentPages(surveyEditorSvc.getPages());

                questionCarryOverSvc.setupData();
                surveyEditorQuestionSvc.handleDoneCreateQuestion();

                questionSvc.setActiveQuestion(null);
                surveyEditorSvc.resetToViewMode();
                pageSvc.setActivePage(newPages[newPages.length - 1].id);

                spinnerUtilSvc.hideSpinner();
                surveyContentValidation.validateLatestSurvey();
                surveyEditorSvc.setSurveyEditMode(false);
            }, function (error) {
                onErrorImportLibrary('Importing library page was not successful', error);
            });
        }

        function importLibraryQuestionsIntoPage(data, page) {
            var libraryQuestionsParameter = {
                pageId: page.id,
                pageVersion: page.version,
                surveyId: page.surveyId,
                questionIds: data.selectedQuestionIds,
                libraryId: data.libraryId
            };

            spinnerUtilSvc.showSpinner();
            fromLibraryDataSvc.importLibraryQuestions(libraryQuestionsParameter).$promise.then(function (response) {
                surveyEditorSvc.setSurveyVersion(response.headers['survey-etag']);
                page.version = response.headers.etag;

                var questions = JSON.parse(response.data);
                var question = null;
                var newQuestionIndex = vm.currentPage.questionDefinitions.length - 1;

                for (var i = 0; i < questions.length; i++) {
                    question = questions[i];
                    question.pageId = page.id;
                    newQuestionIndex += 1;
                    surveyEditorPageSvc.appendQuestionIntoPage(page.id, question, newQuestionIndex);
                    questionCarryOverSvc.setupData();
                    surveyEditorQuestionSvc.handleDoneCreateQuestion();
                }

                spinnerUtilSvc.hideSpinner();
                pageSvc.setActivePage(page.id);

                surveyEditorSvc.resetToViewMode();
                surveyContentValidation.validateLatestSurvey();
            }, function (error) {
                onErrorImportLibrary('Importing library questions was not successful', error);
            });
        }

        function onErrorImportLibrary(message, error) {
            spinnerUtilSvc.hideSpinner();
            if (error.status === httpStatusCode.preConditionFail) {
                toastr.error('This page has changed. Please refresh to get the newest data');
            } else {
                toastr.error(message);
            }
        }

        function getReadyToCreateQuestion(page, questionType) {
            createQuestion(questionType, null, page, undefined, page.questionDefinitions.length);
        }

        function createQuestion(questionType, selectedQuestion, page, isAboveSelectedQuestion, questionIndex) {
            surveyEditorSvc.setSurveyEditMode(true);
            surveyEditorSvc.resetToViewMode();
            pageSvc.handleCreateQuestion($scope, questionType, selectedQuestion, page, isAboveSelectedQuestion, questionIndex);
            questionSvc.setActiveQuestion(null);
            showOverlay(true);
        }

        function truncateQuestionTitle(title) {
            return stringUtilSvc.truncateByWordAmount(title, vm.truncateNumberOfWord, vm.appendValue);
        }

        function getReadyToEditQuestion(question) {
            surveyEditorSvc.setSurveyEditMode(true);

            surveyEditorSvc.resetToViewMode();
            pageSvc.handleEditQuestion(question, vm.currentPage.id, $scope);
            surveyEditorSvc.setQuestionEditorId(question.id);
            pageSvc.setActivePage(null);
            questionSvc.setActiveQuestion(null);
            showOverlay(true);
        }

        function getReadyToEditPage(pageId) {
            surveyEditorSvc.setSurveyEditMode(true);
            surveyEditorSvc.resetToViewMode();
            surveyEditorSvc.setPageEditorId(pageId);

            pageSvc.setActivePage(vm.currentPage.id);
            pageSvc.setSkipCommandEditorId(null);
            showMovingPageIcon(false);
            questionSvc.setActiveQuestion(null);
            vm.page = angular.copy(vm.currentPage);
            showOverlay(true);
        }

        function onDeletePage(event) {
            event.stopPropagation();
            if (vm.pages.length <= vm.generalConstant.MIN_TOTAL_PAGE) return;

            if (vm.questionsInPage.length <= vm.generalConstant.MIN_TOTAL_QUESTION_IN_PAGE) {
                deletePageHasNoQuestion();
            } else {
                deletePageHasQuestion();
            }

            function deletePageHasNoQuestion() {
                surveyEditorSvc.setSurveyEditMode(true);
                spinnerUtilSvc.showSpinner();
                pageDataSvc.deletePage(vm.topFolder, vm.currentPage).$promise.then(function (response) {
                    surveyEditorSvc.setSurveyVersion(response.headers['survey-etag']);
                    surveyEditorSvc.setTopFolderVersion(response.headers.etag);
                    surveyEditorPageSvc.handleDeletePage(vm.currentPage.id);
                    questionSvc.setActiveQuestion(null);
                    pageSvc.setActivePage(null);
                    questionCarryOverSvc.setupData();
                    spinnerUtilSvc.hideSpinner();
                    surveyContentValidation.validateLatestSurvey();
                    surveyEditorSvc.setSurveyEditMode(false);
                }, function (error) {
                    onErrorDeletePage(error);
                });
            }

            function deletePageHasQuestion() {
                var validateResult = pageValidationSvc.validateWhenRemovingPage(vm.currentPage);
                $modal.open({
                    templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                    controller: 'deleteDialogCtrl',
                    windowClass: 'center-modal',
                    backdrop: 'static',
                    resolve: {
                        modalData: function () {
                            return {
                                message: validateResult.confirmMessage
                            };
                        }
                    }
                }).result.then(function (result) {
                    if (!result.status) return;
                    spinnerUtilSvc.showSpinner();
                    surveyEditorSvc.setSurveyEditMode(true);
                    pageDataSvc.deletePage(vm.topFolder, vm.currentPage).$promise.then(function (response) {
                        surveyEditorSvc.setSurveyVersion(response.headers['survey-etag']);
                        surveyEditorSvc.setTopFolderVersion(response.headers.etag);
                        surveyEditorPageSvc.handleDeletePage(vm.currentPage.id);
                        questionCarryOverSvc.setupData();
                        questionSvc.setActiveQuestion(null);
                        pageSvc.setActivePage(null);
                        surveyEditorSvc.resetToViewMode();
                        spinnerUtilSvc.hideSpinner();

                        surveyContentValidation.validateLatestSurvey();
                        surveyEditorSvc.setSurveyEditMode(false);
                    }, function (error) {
                        onErrorDeletePage(error);
                    });
                });
            }

            function onErrorDeletePage(error) {
                spinnerUtilSvc.hideSpinner();
                if (error.status === httpStatusCode.preConditionFail) {
                    errorHandlingSvc.manifestError('This survey has changed. Please refresh to get the newest data', error);
                } else {
                    errorHandlingSvc.manifestError('Deleting page was not successful', error);
                }
                surveyEditorSvc.setSurveyEditMode(false);
            }
        }

        function showPreviewDialog(event) {
            event.stopPropagation();
            $modal.open({
                size: 'lg',
                windowClass: 'large-modal',
                templateUrl: 'survey/page/previewDialog/preview-dialog.html',
                controller: 'previewDialogCtrl',
                backdrop: 'static',
                resolve: {
                    modalData: function () {
                        return {
                            selectSurveyId: vm.currentPage.surveyId,
                            pageId: vm.currentPage.id
                        };
                    }
                }
            }).result.then(function (result) {
                if (!result.status) return;
                spinnerUtilSvc.showSpinner();
            });
        }

        function removeQuestion(event, question) {
            event.stopPropagation();
            var validationResult = pageValidationSvc.validateWhenRemovingQuestion(question);

            $modal.open({
                templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                controller: 'deleteDialogCtrl',
                windowClass: 'center-modal',
                backdrop: 'static',
                resolve: {
                    modalData: function () {
                        return {
                            message: validationResult.confirmMessage
                        };
                    }
                }
            }).result.then(function (result) {
                if (!result.status) return;
                var deleteMessages = {
                    fail: 'Deleting question was not successful.'
                };
                spinnerUtilSvc.showSpinner();
                surveyEditorSvc.setSurveyEditMode(true);
                questionDataSvc.deleteById(vm.currentPage.surveyId, vm.currentPage.id, question, vm.currentPage.version).$promise.then(function (response) {
                    surveyEditorSvc.setSurveyVersion(response.headers['survey-etag']);
                    vm.currentPage.version = response.headers.etag;
                    surveyEditorQuestionSvc.handleRemoveQuestion(question, vm.questionsInPage);

                    pageSvc.setActivePage(vm.currentPage.id);
                    questionCarryOverSvc.setupData();
                    questionSvc.setActiveQuestion(null);
                    surveyEditorSvc.resetToViewMode();

                    spinnerUtilSvc.hideSpinner();
                    surveyContentValidation.validateLatestSurvey();
                    surveyEditorSvc.setSurveyEditMode(false);
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    if (error.status === httpStatusCode.preConditionFail) {
                        errorHandlingSvc.manifestError('This page has changed. Please refresh to get the newest data', error);
                    } else {
                        toastr.error(deleteMessages.fail, error);
                    }
                    surveyEditorSvc.setSurveyEditMode(false);
                });
            });
        }

        function toggleCollapsePage(pageId) {
            var index = vm.collapsedPageIds.indexOf(pageId);
            if (index >= 0) {
                vm.collapsedPageIds.splice(index, 1);
            } else {
                vm.collapsedPageIds.push(pageId);
            }
        }

        function toggleCollapseQuestion(questionId) {
            var index = vm.collapsedQuestionIds.indexOf(questionId);
            if (index >= 0) {
                vm.collapsedQuestionIds.splice(index, 1);
            } else {
                vm.collapsedQuestionIds.push(questionId);
            }
        }

        function getQuestionType(questionType) {
            return questionTypeSvc.getNameQuestionType(questionType);
        }

        function showMovingPageIcon(isShow) {
            if (pageSvc.showMovingPageIcon) pageSvc.showMovingPageIcon(isShow);
        }

        function clickMarkedQuestion(pageId, pageIndex) {
            var divElement = angular.element(document).find('#page-wrap-' + pageIndex);
            angular.element('body').animate({
                scrollTop: divElement.offset().top
            }, 'slow');

            pageSvc.setActivePage(pageId);
            questionSvc.setActiveQuestion(null);
        }

        function getReadyToCreateSkipAction(pageId) {
            surveyEditorSvc.setSurveyEditMode(true);

            surveyEditorSvc.resetToViewMode();
            questionSvc.setActiveQuestion(null);
            pageSvc.handleCreateSkipCommand(vm.topFolder.id, pageId, $scope);
            showOverlay(true);
        }

        function getReadyToEditSkipAction(skipCommand) {
            surveyEditorSvc.setSurveyEditMode(true);
            surveyEditorSvc.resetToViewMode();
            questionSvc.setActiveQuestion(null);
            pageSvc.handleUpdateSkipCommand(vm.topFolder.id, vm.currentPage.id, skipCommand, $scope);
            showOverlay(true);
        }

        function removeSkipAction(event, skipCommandIndex) {
            event.stopPropagation();

            $modal.open({
                templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                controller: 'deleteDialogCtrl',
                windowClass: 'center-modal',
                backdrop: 'static',
                resolve: {
                    modalData: function () {
                        return {
                            message: 'Do you want to delete this skip action?'
                        };
                    }
                }
            }).result.then(function (result) {
                if (!result.status) return;
                var deleteMessages = {
                    fail: 'Deleting skip action was not successful.'
                };

                var modifiedPage = angular.copy(vm.currentPage);
                modifiedPage.skipCommands.splice(skipCommandIndex, 1);

                surveyEditorSvc.setSurveyEditMode(true);
                pageDataSvc.updateSkipCommands(vm.topFolder.id, modifiedPage).$promise.then(function (response) {
                    surveyEditorSvc.setSurveyVersion(response.headers['survey-etag']);
                    vm.currentPage.version = response.headers.etag;

                    surveyEditorSvc.resetToViewMode();
                    pageSvc.setActivePage(vm.currentPage.id);

                    angular.copy(modifiedPage.skipCommands, vm.currentPage.skipCommands);

                    surveyEditorSvc.refreshSummarySkipCommandsInSurvey();
                    surveyEditorSvc.setSurveyEditMode(false);

                    spinnerUtilSvc.hideSpinner();
                    surveyContentValidation.validateLatestSurvey();
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    if (error.status === httpStatusCode.preConditionFail) {
                        errorHandlingSvc.manifestError('This page has changed. Please refresh to get the newest data', error);
                    } else {
                        errorHandlingSvc.manifestError(deleteMessages.fail, error);
                    }
                    surveyEditorSvc.setSurveyEditMode(false);
                });
            });
        }

        function updateQuestionByMoving(movingQuestion, destinationPageId, destinationPageVersion, oldIndexPosition, newIndexPosition) {
            var movingQuestionData = {
                questionId: movingQuestion.id,
                departurePageId: movingQuestion.pageId,
                destinationPageId: destinationPageId,
                destinationPageVersion: destinationPageVersion,
                surveyId: movingQuestion.surveyId,
                newIndexPosition: newIndexPosition,
                oldIndexPosition: oldIndexPosition,
                rowVersion: movingQuestion.rowVersion
            };

            var event = convertMovingQuestionToEvent();
            if (!pageValidationSvc.validateMovingQuestions(event, vm.noneInformationQuestionPositionsInSurvey)) {
                //TODO refactor here: do not need to reload survey when moving question up/down (except move by drag-drop)
                $route.reload();
                return;
            }

            surveyEditorSvc.setSurveyEditMode(true);
            if (destinationPageId !== movingQuestion.pageId) {
                moveToAnotherPage();
                expansePageForMovingAnotherPage();
            } else {
                moveInsidePage();
            }
            return;

            function moveToAnotherPage() {
                spinnerUtilSvc.showSpinner();
                questionDataSvc.moveQuestion(movingQuestionData, vm.currentPage.version).$promise.then(function (response) {
                    var data = JSON.parse(response.data);
                    moveQuestionSvc.handleDoneMoveQuestionToAnotherPage({
                        surveyVersion: response.headers['survey-etag'],
                        movingQuestion: movingQuestion,
                        sourcePageVersion: response.headers.etag,
                        destinationPageId: destinationPageId,
                        destinationPageVersion: data.destinationPageEtag,
                        destinationPageQuestionIds: data.destinationPageQuestionIds
                    });

                    spinnerUtilSvc.hideSpinner();
                    surveyContentValidation.validateLatestSurvey();
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    processMovingError(error);
                });
            }

            function expansePageForMovingAnotherPage() {
                var index = vm.collapsedPageIds.indexOf(movingQuestionData.destinationPageId);
                if (index >= 0) vm.collapsedPageIds.splice(index, 1);
            }

            function moveInsidePage() {
                spinnerUtilSvc.showSpinner();
                questionDataSvc.moveQuestion(movingQuestionData, vm.currentPage.version).$promise.then(function (response) {
                    moveQuestionSvc.handleDoneMoveQuestionsInPage({
                        surveyVersion: response.headers['survey-etag'],
                        pageVersion: response.headers.etag,
                        pageId: vm.currentPage.id,
                        pageQuestionIds: JSON.parse(response.data).destinationPageQuestionIds
                    });
                    spinnerUtilSvc.hideSpinner();
                    surveyContentValidation.validateLatestSurvey();
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    processMovingError(error);
                });
            }

            function processMovingError(error) {
                if (error.status === httpStatusCode.preConditionFail) {
                    errorHandlingSvc.manifestError('This question has changed. Please refresh to get the newest data', error);
                } else {
                    errorHandlingSvc.manifestError('Moving question was not successful.', error);
                }
                surveyEditorSvc.setSurveyEditMode(false);
            }

            function convertMovingQuestionToEvent() {
                return {
                    source: {
                        sortableScope: {
                            $parent: {
                                pageCtrl: {
                                    currentPage: pageSvc.getPageById(movingQuestion.pageId, vm.pages)
                                }
                            }
                        },
                        itemScope: {
                            question: movingQuestion
                        }
                    },
                    dest: {
                        sortableScope: {
                            $parent: {
                                pageCtrl: {
                                    currentPage: pageSvc.getPageById(destinationPageId, vm.pages)
                                }
                            }
                        }
                    }
                };
            }
        }

        function updatePageByMoving(movingPage, oldIndexPosition, newIndexPosition) {
            var event = {
                source: { itemScope: { page: movingPage } }
            };
            var ids = vm.pages.map(function (page) {
                return page.id;
            });
            var temp = ids[oldIndexPosition];

            ids[oldIndexPosition] = ids[newIndexPosition];
            ids[newIndexPosition] = temp;
            if (!surveyEditorValidationSvc.validateMovingPage(vm.pages, event, ids)) return;

            var pageId = movingPage.id;
            var movingPageParam = {
                pageId: movingPage.id,
                surveyId: movingPage.surveyId,
                newPageIndex: newIndexPosition
            };

            surveyEditorSvc.setSurveyEditMode(true);
            spinnerUtilSvc.showSpinner();
            pageDataSvc.movePage(vm.topFolder, movingPageParam).$promise.then(function (response) {
                movePageSvc.handleDoneMovePages({
                    surveyVersion: response.headers['survey-etag'],
                    topFolderVersion: response.headers.etag,
                    topFolderChildIds: JSON.parse(response.data).childIds
                });
                spinnerUtilSvc.hideSpinner();
                surveyContentValidation.validateLatestSurvey();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                if (error.status === httpStatusCode.preConditionFail) {
                    errorHandlingSvc.manifestError('This survey has changed. Please refresh to get the newest data', error);
                } else {
                    toastr.error('Moving page was not successful.');
                }
                surveyEditorSvc.setSurveyEditMode(false);
            });

            if (vm.collapsedPageIds.indexOf(pageId) >= 0) {
                var element = angular.element(document.querySelector("#page-wrap-" + newIndexPosition));
                element.removeClass('in collapsing');
            }

            pageSvc.setActivePage(pageId);
            surveyEditorSvc.resetToViewMode();
            questionSvc.setActiveQuestion(null);
        }

        function movePageUp(page, index) {
            if (index <= 0) return;
            updatePageByMoving(page, index, index - 1);
        }

        function movePageDown(page, index) {
            if (index >= vm.pages.length - 2) return;
            updatePageByMoving(page, index, index + 1);
        }

        function moveQuestionUp(question, index) {
            if ($scope.index === 0 && index === 0) return;
            var pageDefinitionId = question.pageId;
            var pageDefinitionVersion = null;
            var oldIndexPosition = index;
            var newIndexPosition = index - 1;
            if (index <= 0) {
                var position = questionSvc.getMovingPositionByStep(false, pageDefinitionId, vm.pages);
                if (!position) {
                    toastr.error('Moving question is not successful.');
                    return;
                }
                pageDefinitionId = position.pageDefinitionId;
                pageDefinitionVersion = position.pageDefinitionVersion;
                newIndexPosition = position.index;
            }
            updateQuestionByMoving(question, pageDefinitionId, pageDefinitionVersion, oldIndexPosition, newIndexPosition);
        }

        function moveQuestionDown(question, index) {
            //TODO need to check the logic of this function
            var pageDefinitionId = question.pageId;
            var pageDefinitionVersion = null;
            var oldIndexPosition = index;
            var newIndexPosition = index + 1;
            if ($scope.index === (vm.pages.length - 2) && index === (vm.questionsInPage.length - 1)) return;
            if (index >= vm.questionsInPage.length - 1) {
                var position = questionSvc.getMovingPositionByStep(true, pageDefinitionId, vm.pages);
                if (!position) {
                    toastr.error('Moving question is not successful.');
                    return;
                }
                pageDefinitionId = position.pageDefinitionId;
                pageDefinitionVersion = position.pageDefinitionVersion;
                newIndexPosition = position.index;
            }
            updateQuestionByMoving(question, pageDefinitionId, pageDefinitionVersion, oldIndexPosition, newIndexPosition);
        }

        function selectPageByStep(page) {
            if (vm.activePage.pageId === page.id) {
                if (vm.collapsedPageIds.indexOf(page.id) >= 0) {
                    vm.toggleCollapsePage(page.id);
                    return;
                }
                vm.getReadyToEditPage(page.id);
            } else {
                questionSvc.setActiveQuestion(null);
                pageSvc.setActivePage(vm.currentPage.id);
            }
        }

        function selectQuestionByStep(question) {
            //TODO refactor this function to separate question and skip command
            //Now we consider skip command as a question. Don't refactor before merging latest code
            //Question uses id, skip command use clientId
            var id = question.$type === skipCommandQuestionTypeConst ? question.clientId : question.id;
            if (vm.activeQuestion.questionId === id) {
                if (vm.collapsedQuestionIds.indexOf(id) >= 0) {
                    vm.toggleCollapseQuestion(id);
                    return;
                }

                if (question.$type === skipCommandQuestionTypeConst) {
                    vm.getReadyToEditSkipAction(question);
                } else {
                    vm.getReadyToEditQuestion(question);
                }
            } else {
                questionSvc.setActiveQuestion(id);
                pageSvc.setActivePage(null);
            }
        }

        function canClickToMovePageUp() {
            var firstPageIndex = 0;
            return (vm.isThankYouPage || $scope.index === firstPageIndex) ? false : true;
        }

        function canClickToMovePageDown() {
            return (vm.isThankYouPage || $scope.index === vm.pages.length - 2) ? false : true;
        }

        function canClickToDeletePage() {
            return (vm.isThankYouPage || vm.pages.length <= vm.generalConstant.MIN_TOTAL_PAGE) ? false : true;
        }

        function canClickToMoveQuestion(questionId) {
            return (vm.isThankYouPage || vm.activeQuestion.questionId !== questionId) ? false : true;
        }

        function isSelectingQuestion(questionId) {
            return vm.activeQuestion.questionId === questionId;
        }

        function canClickToMoveQuestionUp(questionIndex) {
            if (vm.isThankYouPage) return false;
            return $scope.index === 0 && questionIndex === 0 ? false : true;
        }

        function canClickToMoveQuestionDown(questionIndex) {
            if (vm.isThankYouPage) return false;
            return $scope.index === vm.pages.length - 2 &&
                questionIndex === vm.questionsInPage.length - 1 ? false : true;
        }

        function getPageContainerClasses() {
            var classes = [];
            if (vm.isSelectedPage && !vm.isEditingPage) {
                classes.push('highlight-selection__page-container');
            } else if (vm.isHightlightPage) {
                classes.push('highlight-selection__page-container--hover');
            }
            return classes;
        }


        function getQuestionContainerClasses(question) {
            var classes = [];
            if (vm.isShowUpQuestionOverlay && vm.isEditingQuestion(question.id)) {
                classes.push('overlay-question');
            }
            return classes;
        }

        function getQuestionViewClass(question) {
            var classes = [];
            if (surveyContentValidation.isErrorQuestionContent(question)) {
                classes.push('survey-question--error');
            }
            return classes;
        }

        function getQuestionContentClasses(question) {
            var classes = [];
            if (vm.isSelectingQuestion(question.id)) {
                classes.push('highlight-selection');
            }
            if (vm.isCollapsedQuestion(question.id)) {
                classes.push('question-collapsed-selection');
            }
            return classes;
        }

        function getSkipCommandContainerClasses(skipCommand) {
            var classes = [];
            var expandCollapseClass = vm.collapsedQuestionIds.indexOf(skipCommand.clientId) < 0 ?
                'skip-command-view-container--state--expand' :
                    'skip-command-view-container--state--collapsed';
            classes.push(expandCollapseClass);
            if (vm.skipCommandEditor.id !== skipCommand.clientId) {
                classes.push('skip-command-container--view');
            } else {
                classes.push('skip-command-container--edit');
            }
            if (vm.isShowUpQuestionOverlay && vm.isEditingSkipAction(skipCommand.clientId)) {
                classes.push('overlay-question');
            }

            return classes;
        }

        function getSkipCommandContentClasses(skipCommand) {
            var classes = [];
            if (vm.isSelectingQuestion(skipCommand.clientId)) {
                classes.push('highlight-selection');
            }
            if (surveyContentValidation.isErrorSkipCommandContent(skipCommand)) {
                classes.push('skip-command-view-container--error');
            }
            return classes;
        }

        function isEditingQuestion(questionId) {
            return vm.surveyEditorData.questionEditorId === questionId;
        }

        function isEditingSkipAction(skipCommandId) {
            return pageSvc.getSkipCommandEditor().id === skipCommandId;
        }

        function isCollapsedQuestion(questionId) {
            return questionId !== 0 && vm.collapsedQuestionIds.indexOf(questionId) >= 0;
        }

        function isRequiredQuestion(question) {
            if (!question.validations || question.validations.length === 0) return false;
            var validationTypes = serverValidationSvc.getServerValidationTypes();
            var tempArray = question.validations.filter(function (validation) {
                return validation.$type === validationTypes.required;
            });
            return tempArray.length > 0;
        }

        function showOverlay(isShowed) {
            vm.isShowUpQuestionOverlay = isShowed;
            indexSvc.callbackCheckOverlay(isShowed);
        }

        function duplicateQuestion(question, questionIndex) {
            spinnerUtilSvc.showSpinner();

            var duplicatedQuestion = questionSvc.duplicateQuestionExceptId(question);
            surveyEditorSvc.setSurveyEditMode(true);
            pageDataSvc.duplicateQuestion(vm.currentPage.surveyId, vm.currentPage.id, vm.currentPage.version, duplicatedQuestion).$promise.then(function (response) {
                spinnerUtilSvc.hideSpinner();

                surveyEditorSvc.setSurveyVersion(response.headers['survey-etag']);
                vm.currentPage.version = response.headers.etag; //TODO should call service to update page version

                var newQuestion = JSON.parse(response.data);
                newQuestion.pageId = question.pageId;
                var newQuestionIndex = questionIndex + 1;
                vm.questionsInPage.splice(newQuestionIndex, 0, newQuestion);

                surveyEditorSvc.setupQuestionPositionInSurvey();
                questionSvc.setActiveQuestion(newQuestion.id);
                pageSvc.setActivePage(null);
                questionCarryOverSvc.setupData();
                surveyContentValidation.validateLatestSurvey();
                surveyEditorSvc.setSurveyEditMode(false);
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                if (error.status === httpStatusCode.preConditionFail) {
                    errorHandlingSvc.manifestError('This page has changed. Please refresh to get the newest data', error);
                } else {
                    errorHandlingSvc.manifestError('Duplicating question was not successful', error);
                }
                surveyEditorSvc.setSurveyEditMode(false);
            });
        }

        function onBreakPage(splitPoint) {
            spinnerUtilSvc.showSpinner();
            var breakPageMessages = {
                fail: 'Breaking page was not successful.'
            };
            surveyEditorSvc.setSurveyEditMode(true);
            var newPageTitle = surveyEditorSvc.generateNewPageTitle();
            pageDataSvc.splitPage(vm.topFolder, vm.currentPage, splitPoint, newPageTitle).$promise.then(function (response) {
                surveyEditorSvc.setSurveyVersion(response.headers['survey-etag']);
                surveyEditorSvc.setTopFolderVersion(response.headers.etag);

                var responseData = JSON.parse(response.data);
                vm.currentPage.version = responseData.sourcePage.version;
                var newPage = responseData.newPage;
                newPage.skipCommands = angular.copy(vm.currentPage.skipCommands);
                if (newPage.skipCommands) {
                    newPage.skipCommands.forEach(function (skipCommand) {
                        skipCommand.pageDefinitionId = newPage.id;
                    });
                }

                newPage.questionDefinitions = vm.currentPage.questionDefinitions.slice(splitPoint);

                vm.currentPage.questionDefinitions.splice(splitPoint, vm.currentPage.questionDefinitions.length - splitPoint);
                vm.currentPage.skipCommands.splice(0, vm.currentPage.skipCommands.length);

                vm.pages.splice(getPageIndex() + 1, 0, newPage);

                spinnerUtilSvc.hideSpinner();
                surveyContentValidation.validateLatestSurvey();
                surveyEditorSvc.setSurveyEditMode(false);
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                if (error.status === httpStatusCode.preConditionFail) {
                    errorHandlingSvc.manifestError('This page has changed. Please refresh to get the newest data', error);
                } else {
                    errorHandlingSvc.manifestError(breakPageMessages.fail, error);
                }
                surveyEditorSvc.setSurveyEditMode(false);
            });
        }

        function collapseQuestions() {
            vm.currentPage.questionDefinitions.forEach(function (question) {
                var index = vm.collapsedQuestionIds.indexOf(question.id);
                if (index < 0) {
                    vm.collapsedQuestionIds.push(question.id);
                }
            });
        }

        function expandQuestions() {
            vm.currentPage.questionDefinitions.forEach(function (question) {
                var index = vm.collapsedQuestionIds.indexOf(question.id);
                if (index >= 0) {
                    vm.collapsedQuestionIds.splice(index, 1);
                }
            });
        }

        function getPageIndex() {
            for (var i = 0; i < vm.pages.length; i++) {
                if (vm.pages[i].id === vm.currentPage.id) {
                    return i;
                }
            }
            return -1;
        }

        function addQuestionToLibrary(questionId) {
            var addLibraryMessage = {
                fail: 'Adding question to library was not successful.',
                success: 'Adding question to library was successful.'
            };

            spinnerUtilSvc.showSpinner();
            libraryDataSvc.addQuestion(questionId).$promise.then(function () {
                spinnerUtilSvc.hideSpinner();
                toastr.success(addLibraryMessage.success);
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                toastr.error(addLibraryMessage.fail);
            });

        }

        function addPageToLibrary() {
            var addLibraryMessage = {
                fail: 'Adding page to library was not successful.',
                success: 'Adding page to library was successful.'
            };

            spinnerUtilSvc.showSpinner();
            libraryDataSvc.addPage(vm.currentPage.id).$promise.then(function () {
                spinnerUtilSvc.hideSpinner();
                toastr.success(addLibraryMessage.success);
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                toastr.error(addLibraryMessage.fail);
            });

        }

        function isCollapseAllQuestionsInPage() {
            var isCollapseAllQuestion = true;
            vm.currentPage.questionDefinitions.forEach(function (question) {
                var index = vm.collapsedQuestionIds.indexOf(question.id);
                if (index < 0) {
                    isCollapseAllQuestion = false;
                }
            });
            return isCollapseAllQuestion;
        }

        function isShowQuestionMovingIcon(questionId) {
            return isCollapseAllQuestionsInPage() || isSelectingQuestion(questionId);
        }

        function isShowInsertPageBreak(question) {
            if (vm.activeQuestion.questionId !== question.id) return false;
            if (vm.questionsInPage[vm.questionsInPage.length - 1].alias === question.alias) return false;
            return true;
        }
    }
})();
