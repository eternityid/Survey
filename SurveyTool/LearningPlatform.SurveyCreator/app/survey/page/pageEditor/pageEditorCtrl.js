(function () {
    angular
        .module('svt')
        .controller('pageEditorCtrl', pageEditorCtrl);

    pageEditorCtrl.$inject = ['$routeParams', '$scope', '$rootScope', 'settingConst', 'errorHandlingSvc', 'surveyEditorSvc',
        'pageSvc', 'pageDataSvc', 'lookAndFeelDataSvc', 'pushDownSvc',
        'questionSvc', 'surveyEditorPageSvc', 'surveyEditorDataSvc', 'spinnerUtilSvc',
        'indexSvc', 'lookAndFeelPreviewerSvc', 'surveyContentValidation'];

    function pageEditorCtrl($routeParams, $scope, $rootScope, settingConst, errorHandlingSvc, surveyEditorSvc,
        pageSvc, pageDataSvc, lookAndFeelDataSvc, pushDownSvc,
        questionSvc, surveyEditorPageSvc, surveyEditorDataSvc, spinnerUtilSvc,
        indexSvc, lookAndFeelPreviewerSvc, surveyContentValidation) {
        /* jshint -W040 */
        var vm = this;
        vm.surveyId = $routeParams.id;
        vm.ckeditorConfig = {
            extraPlugins: 'sourcedialog,svtinsertfromfilelibrary',
            toolbarType: 'short',
            svtData: {}
        };
        vm.onPageTitleChange = onPageTitleChange;
        vm.onNavigationBtnSettingChange = onNavigationBtnSettingChange;
        vm.onPageDescriptionChange = onPageDescriptionChange;
        vm.updatingCommandTypes = lookAndFeelPreviewerSvc.getUpdatingCommandTypes();

        vm.close = closeMe;
        vm.save = onClickDone;
        vm.init = init;

        vm.init();

        function init() {
            vm.navigationButtonSettings = $scope.navigationButtonSettings;
            vm.questionOrders = $scope.questionOrders;

            vm.page = $scope.pageObj;

            vm.isThankYouPage = (vm.page.nodeType === 'ThankYouPage') ? true : false;

            vm.handleAfterEditLookAndFeel = handleAfterEditLookAndFeel;
            lookAndFeelPreviewerSvc.getPageInfo = getPageInfo; //TODO need to refactor it
            pushDownSvc.hidePushDown();

            $scope.$on('event:ClickOnOverlayInDesigner', function () {
                closeMe();
            });

            function getPageInfo() {
                return {
                    pageTitle: vm.page.title.items[0].text,
                    pageDescription: vm.page.description.items[0].text
                };
            }
        }

        function handleAfterEditLookAndFeel() {
            closeMe();
        }

        function closeMe() {
            surveyEditorSvc.setSurveyEditMode(false);
            surveyEditorSvc.setPageEditorId(null);
            pageSvc.setActivePage(vm.page.id);
            questionSvc.setActiveQuestion(null);
            indexSvc.callbackCheckOverlay(false);
            if (pageSvc.showMovingPageIcon) pageSvc.showMovingPageIcon(true);
        }

        function onClickDone() {
            $rootScope.$broadcast('event:DoneEditPageSettings', function (validationResult) {
                if (!validationResult.valid) return;
                if (validationResult.pageThemeOverrides && validationResult.pageThemeOverrides.hasOwnProperty('id')) {
                    delete validationResult.pageThemeOverrides.id;
                }
                updatePage(validationResult.lookAndFeelSettings, validationResult.pageThemeOverrides);
            });
        }

        function updatePage(lookAndFeelSettings, pageThemeOverrides) {
            var updateMessages = {
                fail: 'Updating page was not successful.'
            };

            var savingPage = angular.copy(vm.page);
            savingPage.pageThemeOverrides = pageThemeOverrides;
            var newUserTheme = null;

            if (lookAndFeelSettings) {
                savingPage.pageLayoutId = lookAndFeelSettings.layoutId;
                savingPage.pageThemeId = lookAndFeelSettings.themeId;
                if (lookAndFeelSettings.isSaveNewTheme) {
                    newUserTheme = lookAndFeelSettings.theme;
                }
            } else {
                savingPage.pageLayoutId = null;
                savingPage.pageThemeId = null;
            }

            var pageAndThemeForSaving = {
                page: angular.copy(savingPage),
                newUserTheme: newUserTheme
            };

            spinnerUtilSvc.showSpinner();
            pageDataSvc.updatePage($scope.blockId, pageAndThemeForSaving).$promise.then(function (res) {
                surveyEditorSvc.setSurveyVersion(res.headers['survey-etag']);
                var updatedPage = JSON.parse(res.data);

                spinnerUtilSvc.hideSpinner();
                handleUpdatePageSucess(updatedPage);
            }, function (err) {
                spinnerUtilSvc.hideSpinner();
                handleUpdatePageFail(err);
            });

            function handleUpdatePageSucess(updatedPage) {
                surveyEditorSvc.setSurveyEditMode(false);

                surveyEditorPageSvc.updatePageSettings(updatedPage.id, updatedPage);

                surveyEditorSvc.setPageEditorId(null);
                pageSvc.setActivePage(updatedPage.id);
                indexSvc.callbackCheckOverlay(false);
                surveyContentValidation.validateLatestSurvey();
            }

            function handleUpdatePageFail(error) {
                if (error.status === settingConst.httpMethod.preConditionFail) {
                    errorHandlingSvc.manifestError('This page has changed. Please refresh to get the newest data', error);
                } else {
                    errorHandlingSvc.manifestError(updateMessages.fail, error);
                }
            }
        }

        function onPageTitleChange() {
            lookAndFeelPreviewerSvc.updateUpdatingCommand({ pageTitle: vm.page.title.items[0].text }, 'PageTitle');
        }

        function onNavigationBtnSettingChange() {
            lookAndFeelPreviewerSvc.updateUpdatingCommand({ NavigationBtnSetting: vm.page.navigationButtonSettings }, 'NavigationBtnSetting');
        }

        function onPageDescriptionChange() {
            lookAndFeelPreviewerSvc.updateUpdatingCommand({ pageDescription: vm.page.description.items[0].text }, 'PageDescription');
        }

    }
})();
