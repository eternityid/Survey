(function () {
    angular
        .module('svt')
        .controller('surveyEditorCtrl', surveyEditorCtrl);

    surveyEditorCtrl.$inject = [
        '$routeParams', 'pageSvc', 'pageDataSvc', 'questionSvc', 'surveyEditorDataSvc',
        '$scope', '$interval', 'settingConst', '$modal',
        'errorHandlingSvc', 'surveyEditorSvc', 'surveyEditorValidationSvc',
        'httpStatusCode', 'surveyTitleAndStatusSvc', 'pushDownSvc',
        'questionCarryOverSvc', 'spinnerUtilSvc', 'dialogSvc', 'stringUtilSvc', 'guidUtilSvc',
        'surveyContentValidation', 'surveyDataSvc', '$window', 'movePageSvc', 'constantSvc',
        'libraryDataSvc', 'authSvc', 'surveyMenuSvc'

    ];

    function surveyEditorCtrl(
        $routeParams, pageSvc, pageDataSvc, questionSvc, surveyEditorDataSvc,
        $scope, $interval, settingConst, $modal,
        errorHandlingSvc, surveyEditorSvc, surveyEditorValidationSvc,
        httpStatusCode, surveyTitleAndStatusSvc, pushDownSvc,
        questionCarryOverSvc, spinnerUtilSvc, dialogSvc, stringUtilSvc, guidUtilSvc,
        surveyContentValidation, surveyDataSvc, $window, movePageSvc, constantSvc,
        libraryDataSvc, authSvc, surveyMenuSvc) {
        var vm = this;

        vm.surveyEditorTimer = {};
        vm.delayTime = settingConst.delayTime;
        vm.showMovingPageIcon = true;
        vm.pushDownSettings = pushDownSvc.getPushDownSettings();

        vm.surveyId = $routeParams.id;
        vm.surveyTitleDisplay = '';
        vm.selectSurveyId = 0;
        vm.pages = [];
        vm.collapsedPageIds = pageSvc.getCollapsedPageIds();
        vm.collapsedQuestionIds = pageSvc.getCollapsedQuestionIds();
        vm.activePage = pageSvc.getActivePage();
        vm.showMovePageButton = showMovePageButton;
        vm.onAddPage = onAddPage;
        vm.isCollapsedPage = isCollapsedPage;
        vm.isThankYouPage = isThankYouPage;
        vm.showAddPage = showAddPage;
        vm.addSurveyToLibrary = addSurveyToLibrary;
        vm.deleteSurvey = deleteSurvey;
        vm.sortableOptions = {
            orderChanged: function (event) {
                movePage(event);
            },
            containment: 'body',
            accept: function (sourceItemHandleScope) {
                surveyEditorSvc.resetToViewMode();
                return (sourceItemHandleScope.itemScope.page) ? true : false;
            },
            dragStart: function () {
                surveyEditorSvc.setSurveyEditMode(true);
            },
            dragEnd: function () {
                surveyEditorSvc.setSurveyEditMode(false);
            }
        };

        vm.isSelectedSurveyId = isSelectedSurveyId;
        vm.loadSurvey = loadSurvey;

        vm.showSurveyEditor = showSurveyEditor;
        vm.handleAfterUpdateSurveySetting = handleAfterUpdateSurveySetting;

        vm.showLookAndFeelSetting = showLookAndFeelSetting;
        vm.handleAfterEditLookAndFeel = handleAfterEditLookAndFeel;

        vm.duplicateSurvey = duplicateSurvey;
        vm.showExportSurvey = showExportSurvey;
        vm.showAccessRights = showAccessRights;
        vm.showPreviewDialog = showPreviewDialog;
        vm.onMergePages = onMergePages;

        vm.collapseAllPages = collapseAllPages;
        vm.collapseAllQuestions = collapseAllQuestions;
        vm.expandAll = expandAll;
        vm.isCollapsedAllPage = isCollapsedAllPage;
        vm.hasAccessRights = false;

        init();

        function init() {
            surveyMenuSvc.updateMenuForSurveyDesigner(vm.surveyId);
            setupWatchSurveyAccessMode();
            setupOnDestroy();
            surveyEditorSvc.setSurveyEditMode(false);

            loadSurvey(vm.surveyId);
            pageSvc.showMovingPageIcon = showMovingPageIcon; //TODO don't do this way, please

            function setupWatchSurveyAccessMode() {
                $scope.$watch(function () {
                    return surveyEditorSvc.getPermitRefreshSurvey();
                }, function (newValue) {
                    if (newValue) {
                        initSurveyEditorTimer();
                    } else {
                        destroySurveyEditorTimer();
                    }
                });
            }

            function setupOnDestroy() {
                $scope.$on('$destroy', function () {
                    destroySurveyEditorTimer();
                });
            }
        }

        function showSurveyEditor() {
            surveyEditorSvc.resetToViewMode();
            pushDownSvc.showCreateSurvey();
        }

        function handleAfterUpdateSurveySetting() {
            loadSurvey(vm.surveyId);
            surveyTitleAndStatusSvc.updateLatestChangedTimestamp();
        }

        function movePage(event) {
            if (!surveyEditorValidationSvc.validateMovingPage(vm.pages, event)) {
                surveyEditorSvc.resetMovingPageEvent(event);
                return;
            }

            var movingPage = surveyEditorSvc.buildMovingPage(event),
                pageId = event.source.itemScope.page.id;

            surveyEditorSvc.setSurveyEditMode(true);
            spinnerUtilSvc.showSpinner();
            pageDataSvc.movePage(vm.topFolder, movingPage).$promise.then(function (response) {
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
                var element = angular.element(document.querySelector("#page-wrap-" + event.dest.index));
                element.removeClass('in collapsing');
            }

            pageSvc.setActivePage(movingPage.pageId);
            surveyEditorSvc.resetToViewMode();
            questionSvc.setActiveQuestion(null);
        }

        function loadSurvey(surveyId) {
            vm.selectSurveyId = surveyId;
            questionSvc.setSelectedSurveyId(vm.selectSurveyId);

            spinnerUtilSvc.showSpinner();
            surveyEditorDataSvc.getSurvey(surveyId).$promise.then(function (survey) {
                setupSurveyData(survey);
                vm.surveyName = survey.name;
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Loading survey was not successful.', error);
            });

        }

        function reloadSurvey(surveyId, isSpinnerShow) {
            vm.selectSurveyId = surveyId;
            questionSvc.setSelectedSurveyId(vm.selectSurveyId);

            if (isSpinnerShow === true) spinnerUtilSvc.showSpinner();

            surveyEditorDataSvc.getSurvey(surveyId, vm.survey.version).$promise.then(function (survey) {
                setupSurveyData(survey);
                vm.surveyName = survey.name;
                if (isSpinnerShow === true) spinnerUtilSvc.hideSpinner();
            }, function (error) {
                if (isSpinnerShow === true) spinnerUtilSvc.hideSpinner();
                if (error.status !== httpStatusCode.notModified) {
                    errorHandlingSvc.manifestError('Loading survey was not successful.', error);
                }
            });
        }

        function setupSurveyData(survey) {
            surveyEditorSvc.setupClientSurveyFromApiSurvey(survey);
            questionCarryOverSvc.setupData();
            surveyContentValidation.validateLatestSurvey();
            pageSvc.setCurrentPages(surveyEditorSvc.getPages());

            vm.survey = surveyEditorSvc.getSurvey();
            populateSurveyMetaData(vm.survey);

            vm.topFolder = surveyEditorSvc.getSurvey().topFolder;
            vm.pages = vm.topFolder.childNodes;

            verifyAccessRights();
        }

        function populateSurveyMetaData(survey) {
            var loginData = authSvc.getLoginData();
            if (loginData) {
                survey.isUserHaveFullPermission = (survey.userId === loginData.userId) ||
                    (survey.accessRights && survey.accessRights.full.indexOf(loginData.userId) >= 0);
            }
        }

        function isSelectedSurveyId(surveyId) {
            return vm.selectSurveyId === surveyId;
        }

        function showLookAndFeelSetting() {
            surveyEditorSvc.resetToViewMode();
            pushDownSvc.showLookAndFeel();
        }

        function handleAfterEditLookAndFeel() {
            loadSurvey(vm.selectSurveyId);
        }

        function duplicateSurvey() {
            spinnerUtilSvc.showSpinner();
            surveyDataSvc.duplicateSurvey(vm.surveyId).$promise.then(function () {
                toastr.success('Duplicating survey was successful');
                spinnerUtilSvc.hideSpinner();
                $window.location.href = '#/surveys';
            }, function (error) {
                toastr.error('Duplicating survey was not successful');
                spinnerUtilSvc.hideSpinner();
            });
        }

        function showExportSurvey() {
            surveyEditorSvc.resetToViewMode();
            pushDownSvc.showExportSurvey();
        }

        function showAccessRights() {
            surveyEditorSvc.resetToViewMode();
            pushDownSvc.showAccessRights();
        }

        function initSurveyEditorTimer() {
            vm.surveyEditorTimer = $interval(function () {
                reloadSurvey(vm.surveyId);
            }, vm.delayTime);
        }

        function destroySurveyEditorTimer() {
            $interval.cancel(vm.surveyEditorTimer);
        }

        function showPreviewDialog() {
            pushDownSvc.hidePushDown();
            $modal.open({
                size: 'lg',
                windowClass: 'large-modal',
                templateUrl: 'survey/page/previewDialog/preview-dialog.html',
                controller: 'previewDialogCtrl',
                backdrop: 'static',
                resolve: {
                    modalData: function () {
                        return {
                            selectSurveyId: vm.surveyId
                        };
                    }
                }
            }).result.then(function (result) {
                if (!result.status) return;
                spinnerUtilSvc.showSpinner();
            });
        }

        function showMovingPageIcon(isShow) {
            vm.showMovingPageIcon = isShow;
        }

        function showMovePageButton(page) {
            return (vm.showMovingPageIcon && !vm.isThankYouPage(page)) && (vm.isCollapsedPage(page) || vm.activePage.pageId === page.id);
        }

        function isCollapsedPage(page) {
            return vm.collapsedPageIds.indexOf(page.id) >= 0 ? true : false;
        }

        function isThankYouPage(page) {
            return page.nodeType === 'ThankYouPage';

        }

        function showAddPage(index, page) {
            return !vm.isCollapsedPage(page) || (vm.pages[index - 1] && !vm.isCollapsedPage(vm.pages[index - 1]));
        }

        function onAddPage(newPageIndex) {
            spinnerUtilSvc.showSpinner();
            var addMessages = {
                fail: 'Creating page was not successful.'
            };

            surveyEditorSvc.setSurveyEditMode(true);
            var newPageTitle = surveyEditorSvc.generateNewPageTitle();
            pageDataSvc.addPage(vm.topFolder, newPageIndex, newPageTitle).$promise.then(function (response) {
                surveyEditorSvc.setSurveyVersion(response.headers['survey-etag']);
                surveyEditorSvc.setTopFolderVersion(response.headers.etag);

                var newPage = JSON.parse(response.data);
                surveyEditorSvc.addNewPageFromApi(newPage, newPageIndex);
                pageSvc.setCurrentPages(surveyEditorSvc.getPages());

                questionSvc.setActiveQuestion(null);
                surveyEditorSvc.resetToViewMode();
                pageSvc.setActivePage(newPage.id);

                spinnerUtilSvc.hideSpinner();
                surveyContentValidation.validateLatestSurvey();
                surveyEditorSvc.setSurveyEditMode(false);
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                if (error.status === httpStatusCode.preConditionFail) {
                    errorHandlingSvc.manifestError('This survey has changed. Please refresh to get the newest data', error);
                } else {
                    errorHandlingSvc.manifestError(addMessages.fail, error);
                }
                surveyEditorSvc.setSurveyEditMode(false);
            });
        }

        function onMergePages(belowPageIndex, belowPage) {
            var upperPage = vm.pages[belowPageIndex - 1];
            var upperPageTitle = stringUtilSvc.getPlainText(upperPage.title.items[0].text);
            var belowPageTitle = stringUtilSvc.getPlainText(belowPage.title.items[0].text);
            var modalTitle = 'Confirmation';
            var message = 'You are merging page <strong>' + upperPageTitle + '</strong> and page <strong>' + belowPageTitle + '</strong>. This will remove all the properties of <strong>' + belowPageTitle + '</strong>. Do you want to continue?';
            var okTitle = 'Merge';
            dialogSvc.openDialog(modalTitle, message, okTitle).then(function (result) {
                if (!result.status) return;

                spinnerUtilSvc.showSpinner();
                var mergePageMessages = {
                    fail: 'Merging page was not successful.'
                };

                surveyEditorSvc.setSurveyEditMode(true);
                pageDataSvc.mergePage(vm.topFolder, upperPage, belowPage).$promise.then(function (response) {
                    surveyEditorSvc.setSurveyVersion(response.headers['survey-etag']);
                    surveyEditorSvc.setTopFolderVersion(response.headers.etag);

                    var newPage = JSON.parse(response.data);
                    upperPage.version = newPage.version;

                    angular.copy(newPage.questionDefinitions, upperPage.questionDefinitions);
                    upperPage.questionDefinitions.forEach(function (question) {
                        question.pageId = upperPage.id;
                    });
                    angular.copy(newPage.skipCommands, upperPage.skipCommands);
                    upperPage.skipCommands.forEach(function (skipCommand) {
                        skipCommand.clientId = guidUtilSvc.createGuid();
                        skipCommand.lastDataChanged = new Date();
                    });
                    vm.pages.splice(belowPageIndex, 1);
                    surveyEditorSvc.setupQuestionPositionInSurvey();

                    spinnerUtilSvc.hideSpinner();
                    surveyContentValidation.validateLatestSurvey();
                    surveyEditorSvc.setSurveyEditMode(false);
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    if (error.status === httpStatusCode.preConditionFail) {
                        errorHandlingSvc.manifestError('This survey has changed. Please refresh to get the newest data', error);
                    } else {
                        errorHandlingSvc.manifestError(mergePageMessages.fail, error);
                    }
                    surveyEditorSvc.setSurveyEditMode(false);
                });
            });
        }

        function collapseAllPages() {
            vm.pages.forEach(function (page) {
                var index = vm.collapsedPageIds.indexOf(page.id);
                if (index < 0) {
                    vm.collapsedPageIds.push(page.id);
                }
            });
        }

        function scanQuestions(callback) {
            vm.pages.forEach(function (page) {
                page.questionDefinitions.forEach(function (question) {
                    var index = vm.collapsedQuestionIds.indexOf(question.id);
                    callback(index, question);
                });
            });
        }

        function collapseAllQuestions() {
            scanQuestions(function (index, question) {
                if (index < 0) {
                    vm.collapsedQuestionIds.push(question.id);
                }
            });
            expandAllPages();
        }

        function expandAllQuestions() {
            scanQuestions(function (index, question) {
                if (index >= 0) {
                    vm.collapsedQuestionIds.splice(index, 1);
                }
            });
        }

        function expandAll() {
            expandAllPages();
            expandAllQuestions();
        }

        function expandAllPages() {
            vm.pages.forEach(function (page) {
                var index = vm.collapsedPageIds.indexOf(page.id);
                if (index >= 0) {
                    vm.collapsedPageIds.splice(index, 1);
                }
            });
        }

        function isCollapsedAllPage() {
            return vm.pages.length === vm.collapsedPageIds.length;
        }

        function verifyAccessRights() {
            surveyEditorDataSvc.getUser().$promise.then(function (result) {
                vm.hasAccessRights = surveyEditorSvc.hasAccessRights(result);
            }, function (error) {
                toastr.error('Get users in this company was not successful');
            });
        }

        function addSurveyToLibrary() {
            spinnerUtilSvc.showSpinner();
            libraryDataSvc.addSurvey(vm.surveyId).$promise.then(function () {
                spinnerUtilSvc.hideSpinner();
                toastr.success('Adding survey to library was not successful.');
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                toastr.error('Adding survey to library was not successful.', error);
            });
        }

        function deleteSurvey() {
            var survey = vm.survey;
            $modal.open({
                templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                controller: 'deleteDialogCtrl',
                windowClass: 'center-modal',
                resolve: {
                    modalData: function () {
                        return {
                            message: constantSvc.messages.deleteSurvey + survey.name + '?'
                        };
                    }
                }
            }).result.then(function (result) {
                if (!result.status) return;
                spinnerUtilSvc.showSpinner();
                surveyDataSvc.deleteSurvey(survey.id).$promise.then(function () {
                    spinnerUtilSvc.hideSpinner();
                    $window.location.href = '#/surveys';
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    if (error.status !== errorCode.Unauthorized) {
                        errorHandlingSvc.manifestError('Deleting survey was not successful', error);
                    }
                });
            });
        }
    }
})();