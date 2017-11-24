(function () {
    angular
        .module('svt')
        .controller('lookAndFeelSettingsCtrl', LookAndFeelSettingsCtrl);

    LookAndFeelSettingsCtrl.$inject = [
        '$scope', '$modal', 'errorHandlingSvc',
        'lookAndFeelSettingsSvc', 'surveyEditorSvc', 'layoutDataSvc',
        'themeDataSvc',
        '$q', 'lookAndFeelPreviewerSvc',
        'fileStatus', '$rootScope', 'surveyLookAndFeelSettingsSvc', 'pageLookAndFeelSettingsSvc',
        'surveyDataSvc', 'fileLibraryConstants', 'settingConst'
    ];

    function LookAndFeelSettingsCtrl($scope, $modal, errorHandlingSvc,
        lookAndFeelSettingsSvc, surveyEditorSvc, layoutDataSvc,
        themeDataSvc,
        $q, lookAndFeelPreviewerSvc,
        fileStatus, $rootScope, surveyLookAndFeelSettingsSvc, pageLookAndFeelSettingsSvc,
        surveyDataSvc, fileLibraryConstants, settingConst) {

        var currentSurvey = surveyEditorSvc.getSurvey();

        var basedLookAndFeel = {}; // We use this to compare with current Look and Feel
        var customThemeName = "Custom Theme";
        var systemThemeType = 0;
        var customThemeType = 2;
        var unsavedCustomThemeId = '0';
        var vm = this;

        vm.trackingChanges = {};
        //TODO reimplement me
        vm.placeHolders = lookAndFeelSettingsSvc.getPlaceHolders();
        vm.themeChanged = false;
        vm.layoutChanged = false;
        vm.permitOverridden = true;

        vm.init = init;
        vm.onChangeTheme = onChangeTheme;
        vm.onLayoutChange = onLayoutChange;
        vm.onChangeBackgroundImage = onChangeBackgroundImage;
        vm.onChangeLogo = onChangeLogo;
        vm.onFontChanged = onFontChanged;
        vm.onThemeContentChange = onThemeContentChange;
        vm.onErrorBackgroundColorBlur = onErrorBackgroundColorBlur;
        vm.onInputFieldBackgroundColorBlur = onInputFieldBackgroundColorBlur;
        vm.onThemeNameKeyPress = onThemeNameKeyPress;
        vm.pickBackgroundImage = pickBackgroundImage;
        vm.pickLogoImage = pickLogoImage;

        init();

        function init() {
            var surveyId = surveyEditorSvc.getSurvey().id;

            vm.dataLoading = true;
            vm.canShowInactiveSlider = false;
            $q.all([
                layoutDataSvc.getAllLayouts().$promise,
                themeDataSvc.getAvailableThemesForSurvey(surveyId).$promise,
                surveyDataSvc.getSurveyBrief(surveyId).$promise
            ]).then(function (result) {
                vm.dataLoading = false;
                var themes = result[1];

                lookAndFeelSettingsSvc.setCurrentSurvey(result[2]);

                basedLookAndFeel = lookAndFeelSettingsSvc.getBasedLookAndFeel(themes, $scope.page);
                lookAndFeelSettingsSvc.keepSurveyCustomTheme(themes);

                if ($scope.page) {
                    vm.model = pageLookAndFeelSettingsSvc.getLookAndFeelBindingModel($scope.page, result[0], result[1]);
                    setupTrackingChanges();
                } else {
                    vm.model = surveyLookAndFeelSettingsSvc.getLookAndFeelBindingModel(result[0], result[1]);
                    surveyLookAndFeelSettingsSvc.ensureHaveCustomTheme(vm.model.themes);
                }
                lookAndFeelSettingsSvc.setDefaultBackGroundSettings(vm.model.theme);
                lookAndFeelPreviewerSvc.addReloadCommand(initLookAndFeelPreviewModel());
            }, function (error) {
                vm.dataLoading = false;
                errorHandlingSvc.manifestError('Getting layouts & themes was not successful.', error);
            });
            if ($scope.page) {
                vm.permitOverridden = pageLookAndFeelSettingsSvc.isPageLookAndFeelOverridden($scope.page);
            }

            setupEvents();
            return;

            function setupTrackingChanges() {

                $scope.$watch(function () {
                    return $scope.page.orderType;
                }, function (oldValue, newValue) {
                    if (oldValue !== newValue) {
                        lookAndFeelPreviewerSvc.addReloadCommand(initLookAndFeelPreviewModel());
                    }
                });

                $scope.$watch(function () {
                    return $scope.page.NavigationButtonSettings;
                }, function (oldValue, newValue) {
                    if (oldValue !== newValue) {
                        lookAndFeelPreviewerSvc.addReloadCommand(initLookAndFeelPreviewModel());
                    }
                });

                $scope.$watch(function () {
                    return vm.model.layoutId;
                }, function () {
                    vm.trackingChanges = pageLookAndFeelSettingsSvc.detectTrackingChanges(basedLookAndFeel, vm.model);
                });
                $scope.$watch(function () {
                    return vm.model.themeId;
                }, function () {
                    vm.trackingChanges = pageLookAndFeelSettingsSvc.detectTrackingChanges(basedLookAndFeel, vm.model);
                });
                $scope.$watch(function () {
                    return vm.model.fontSelectorData.font;
                }, function () {
                    vm.model.theme.font = vm.model.fontSelectorData.font;
                });
                $scope.$watch(function () {
                    return vm.model.theme;
                }, function () {
                    vm.trackingChanges = pageLookAndFeelSettingsSvc.detectTrackingChanges(basedLookAndFeel, vm.model);
                }, true);
            }

            function setupEvents() {
                $scope.$on('event:DoneEditPageSettings', function (event, callBack) {
                    callBack({
                        valid: validateBeforeSave(),
                        lookAndFeelSettings: getLookAndFeelDataForBackend(),
                        pageThemeOverrides: getPageThemeOverrides()
                    });
                });
                $scope.$on('event:DoneSurveyLookAndFeel', function (event, callBack) {
                    callBack({
                        valid: validateBeforeSave(),
                        lookAndFeelSettings: getLookAndFeelDataForBackend()
                    });
                });
                $scope.$watch(function () {
                    return angular.element('#look-and-feel-settings-part').is(':visible');
                }, function (newValue) {
                    if (newValue) {
                        vm.canShowInactiveSlider = true;
                    }
                });

            }

            function validateBeforeSave() {
                if ($scope.page && vm.permitOverridden === false) return true;
                if (vm.model.newTheme.permitSave && !lookAndFeelSettingsSvc.validateNewTheme(vm.model, vm.placeHolders)) return false;
                if (!lookAndFeelSettingsSvc.validateLookAndFeelSettings(vm.model)) return false;
                return true;
            }

            function getLookAndFeelDataForBackend() {
                if ($scope.page && vm.permitOverridden === false) return null;
                vm.model.theme.font = vm.model.fontSelectorData.font;
                return lookAndFeelSettingsSvc.buildLookAndFeelDataForBackend(vm.model, $scope.page, basedLookAndFeel);
            }

            function getPageThemeOverrides() {
                if ($scope.page && vm.permitOverridden === false) return null;
                return pageLookAndFeelSettingsSvc.parsePageThemeOverrides(vm.model, $scope.page);
            }

        }

        function onChangeTheme() {
            //Update setting configuration
            lookAndFeelSettingsSvc.updateModelByChangingTheme(vm.model);
            lookAndFeelSettingsSvc.setDefaultBackGroundSettings(vm.model.theme);

            if ($scope.page) {
                basedLookAndFeel.theme = angular.copy(pageLookAndFeelSettingsSvc.getBasedThemePerPage(vm.model, $scope.page));
                basedLookAndFeel.themeId = basedLookAndFeel.theme.id;
            }

            //Update preview
            lookAndFeelPreviewerSvc.addReloadCommand(initLookAndFeelPreviewModel());
            lookAndFeelPreviewerSvc.updatePreviewThemeCommand(vm.model.theme);
        }

        function initLookAndFeelPreviewModel() {
            return $scope.page ?
                pageLookAndFeelSettingsSvc.initPageLookAndFeelPreviewModel(basedLookAndFeel, vm.model, $scope.page) :
                surveyLookAndFeelSettingsSvc.initSurveyLookAndFeelPreviewModel(vm.model);
        }

        function onLayoutChange() {
            basedLookAndFeel.layoutId = vm.model.layoutId;
            lookAndFeelPreviewerSvc.addReloadCommand(initLookAndFeelPreviewModel());
            lookAndFeelPreviewerSvc.updatePreviewThemeCommand(vm.model.theme);
        }

        function onChangeBackgroundImage(backgroundImagePath) {
            vm.model.theme.backgroundImage = backgroundImagePath;
            var lookAndFeelBindingModel = initLookAndFeelPreviewModel();
            if (!$scope.page) {
                lookAndFeelBindingModel.backgroundImage = backgroundImagePath;
            } else if (lookAndFeelBindingModel.overridePageTheme) {
                lookAndFeelBindingModel.overridePageTheme.backgroundImage = backgroundImagePath;
            }

            if (backgroundImagePath) {
                lookAndFeelBindingModel.temporaryPictures.push(backgroundImagePath);
            }
            changeModelByChangingThemeProperty();
            lookAndFeelPreviewerSvc.addReloadCommand(lookAndFeelBindingModel);
        }

        function onChangeLogo(logoPath) {
            vm.model.theme.logo = logoPath;
            var lookAndFeelBindingModel = initLookAndFeelPreviewModel();
            if (!$scope.page) {
                lookAndFeelBindingModel.logo = logoPath;
            } else if (lookAndFeelBindingModel.overridePageTheme) {
                lookAndFeelBindingModel.overridePageTheme.logo = logoPath;
            }

            if (logoPath) {
                lookAndFeelBindingModel.temporaryPictures.push(logoPath);
            }
            changeModelByChangingThemeProperty();
            lookAndFeelPreviewerSvc.addReloadCommand(lookAndFeelBindingModel);
        }

        function onErrorBackgroundColorBlur() {
            if (vm.model.theme.errorBackgroundColor === null || vm.model.theme.errorBackgroundColor === undefined || vm.model.theme.errorBackgroundColor === '') {
                vm.model.theme.errorBackgroundColor = 'transparent';
                onThemeContentChange();
            }
        }

        function onInputFieldBackgroundColorBlur() {
            if (vm.model.theme.inputFieldBackgroundColor === null || vm.model.theme.inputFieldBackgroundColor === undefined || vm.model.theme.inputFieldBackgroundColor === '') {
                vm.model.theme.inputFieldBackgroundColor = 'transparent';
                onThemeContentChange();
            }
        }

        function onFontChanged() {
            vm.model.theme.font = vm.model.fontSelectorData.font;
            onThemeContentChange();
        }

        function onThemeContentChange() {
            changeModelByChangingThemeProperty();
            lookAndFeelPreviewerSvc.updatePreviewThemeCommand(vm.model.theme);
        }

        function changeModelByChangingThemeProperty() {
            if ($scope.page) {
                if (vm.model.theme.id === unsavedCustomThemeId) {
                    lookAndFeelSettingsSvc.updateThemesByCurrentTheme(vm.model);
                } else {
                    pageLookAndFeelSettingsSvc.switchToPageCustomTheme(vm.model);
                }
            } else {
                if (vm.model.theme.type === systemThemeType) {
                    surveyLookAndFeelSettingsSvc.switchToSurveyCustomTheme(vm.model);
                } else {
                    lookAndFeelSettingsSvc.updateThemesByCurrentTheme(vm.model);
                }

                if (vm.model.theme.type === customThemeType) {
                    vm.model.theme.hasChanged = true;
                }
            }
        }

        function onThemeNameKeyPress(event) {
            if (event.which === 13) {
                $rootScope.$emit('event:QuickSaveLookAndFeelSettings');
            }
        }

        function pickLogoImage() {
            $modal.open({
                templateUrl: 'survey/fileLibrary/pickerUploader/file-library-picker-uploader-dialog.html',
                controller: 'fileLibraryPickerUploaderDialogCtrl as vm',
                size: 'lg',
                windowClass: 'center-modal file-library',
                backdrop: 'static',
                resolve: {
                    modalData: function () {
                        return {
                            config: {
                                maxFileSize: 100 * 1024,
                                acceptMimeTypes: fileLibraryConstants.IMAGE_MIME_TYPES,
                                allowChangeImageDimension: fileLibraryConstants.ALLOW_CHANGE_IMAGE_DIMENSION
                            },
                            imageUrl: vm.model.theme.logo ? settingConst.surveyPictureBaseAzurePath + '/' + vm.model.theme.logo : null
                        };
                    }
                }
            }).result.then(function (blob) {
                if (!blob) return;
                onChangeLogo(blob.uri.replace(settingConst.surveyPictureBaseAzurePath + '/', ''));
            });
        }

        function pickBackgroundImage() {
            $modal.open({
                templateUrl: 'survey/fileLibrary/pickerUploader/file-library-picker-uploader-dialog.html',
                controller: 'fileLibraryPickerUploaderDialogCtrl as vm',
                size: 'lg',
                windowClass: 'center-modal file-library',
                backdrop: 'static',
                resolve: {
                    modalData: function () {
                        return {
                            config: {
                                maxFileSize: 1 * 1024 * 1024,
                                acceptMimeTypes: fileLibraryConstants.IMAGE_MIME_TYPES,
                                allowChangeImageDimension: !fileLibraryConstants.ALLOW_CHANGE_IMAGE_DIMENSION
                            },
                            imageUrl: vm.model.theme.backgroundImage ? settingConst.surveyPictureBaseAzurePath + '/' + vm.model.theme.backgroundImage : null
                        };
                    }
                }
            }).result.then(function (blob) {
                if (!blob) return;
                onChangeBackgroundImage(blob.uri.replace(settingConst.surveyPictureBaseAzurePath + '/', ''));
            });
        }
    }
})();