(function () {
    angular
        .module('svt')
        .factory('lookAndFeelSettingsSvc', LookAndFeelSettingsSvc);

    LookAndFeelSettingsSvc.$inject = ['fileStatus', 'colorUtilSvc'];

    function LookAndFeelSettingsSvc(fileStatus, colorUtilSvc) {
        var service = {
            unsavedCustomThemeId: '0',
            customThemeType: 2,
            customThemeName: 'Custom Theme',
            currentSurvey: {},
            savedCustomTheme: undefined,

            setCurrentSurvey: setCurrentSurvey,
            initModelData: initModelData,
            getPlaceHolders: getPlaceHolders,
            validateLookAndFeelSettings: validateLookAndFeelSettings,
            buildLookAndFeelDataForBackend: buildLookAndFeelDataForBackend,
            validateNewTheme: validateNewTheme,

            upsertUnsavedCustomThemeIntoThemes: upsertUnsavedCustomThemeIntoThemes,
            keepSurveyCustomTheme: keepSurveyCustomTheme,
            getThemeByCondition: getThemeByCondition,
            getBasedLookAndFeel: getBasedLookAndFeel,
            updateModelByChangingTheme: updateModelByChangingTheme,
            initLookAndFeelPreviewModel: initLookAndFeelPreviewModel,
            updateThemesByCurrentTheme: updateThemesByCurrentTheme,
            setDefaultBackGroundSettings: setDefaultBackGroundSettings
        };
        return service;

        function setCurrentSurvey(survey) {
            service.currentSurvey = angular.copy(survey);
        }

        function keepSurveyCustomTheme(themes) {
            service.savedCustomTheme = service.getThemeByCondition(themes, { name: 'type', value: service.customThemeType });
        }

        function getThemeByCondition(themes, condition) {
            if (!themes || !condition) return null;
            if (!condition.name || condition.value === undefined) return null;

            for (var i = 0; i < themes.length; i++) {
                if (themes[i][condition.name] === condition.value) return angular.copy(themes[i]);
            }
            return null;
        }

        function getBasedLookAndFeel(themes, page) {
            var layoutId = page && page.pageLayoutId ? page.pageLayoutId : service.currentSurvey.layoutId;
            var themeId = page && page.pageThemeId ? page.pageThemeId : service.currentSurvey.themeId;

            return {
                layoutId: layoutId,
                themeId: themeId,
                theme: angular.copy(getThemeByCondition(themes, { name: 'id', value: themeId }))
            };
        }

        function initModelData() {
            return {
                surveyId: service.currentSurvey.id,
                rowVersion: service.currentSurvey.surveySettings.rowVersion,
                newTheme: {
                    permitSave: false,
                    name: ''
                },
                fontSelectorData: {},
                inactiveOpacity: getDefaultInactiveOpacitySetting(),
                backgroundOpacity: getDefaultBackgroundOpacitySetting()
            };

            function getDefaultInactiveOpacitySetting() {
                return {
                    min: 0.2,
                    max: 1,
                    step: 0.01,
                    precision: 2
                };
            }

            function getDefaultBackgroundOpacitySetting() {
                return {
                    min: 0,
                    max: 1,
                    step: 0.01,
                    precision: 2
                };
            }
        }

        function getPlaceHolders() {
            return {
                themeName: {
                    value: 'New theme name',
                    valid: true
                }
            };
        }

        function validateLookAndFeelSettings(modelData) {
            return validateTheme() &&
                validateLayout() &&
                validateThemeProperties();

            function validateTheme() {
                if (!modelData.themeId) {
                    toastr.error('Please choose theme');
                    return false;
                }
                return true;
            }

            function validateLayout() {
                if (!modelData.layoutId) {
                    toastr.error('Please choose layout');
                    return false;
                }
                return true;
            }

            function validateThemeProperties() {
                var theme = modelData.theme;
                var colorAndTitles = [
                    { title: 'Background', color: theme.backgroundColor },
                    { title: 'Error background', color: theme.errorBackgroundColor },
                    { title: 'Error text', color: theme.errorColor },
                    { title: 'Question title', color: theme.questionTitleColor },
                    { title: 'Question description', color: theme.questionDescriptionColor },
                    { title: 'Question content', color: theme.questionContentColor },
                    { title: 'Input field background', color: theme.inputFieldBackgroundColor },
                    { title: 'Input field', color: theme.inputFieldColor },
                    { title: 'Primary button background', color: theme.primaryButtonBackgroundColor },
                    { title: 'Primary button', color: theme.primaryButtonColor },
                    { title: 'Default button background', color: theme.defaultButtonBackgroundColor },
                    { title: 'Default button', color: theme.defaultButtonColor },
                    { title: 'Page container background', color: theme.pageContainerBackgroundColor }
                ];
                var errorIndex = colorAndTitles.findIndex(function (colorAndTitle) {
                    return colorAndTitle.color.toLowerCase().trim() !== 'inherit' &&
                        colorAndTitle.color.toLowerCase().trim() !== 'transparent' &&
                        !colorUtilSvc.isValidColor(colorAndTitle.color);
                });
                if (errorIndex < 0) return true;
                toastr.error(colorAndTitles[errorIndex].title + ' color is invalid');
                return false;
            }
        }

        function buildLookAndFeelDataForBackend(clientLookAndFeelSettings, page, basedLookAndFeel) {
            var modelData = angular.copy(clientLookAndFeelSettings);
            setDefaultValidThemeProperties();
            processInactiveOpacity();
            processBackgroundOpacity();

            var isSaveNewTheme = false;
            if (modelData.newTheme.permitSave) {
                modelData.theme.name = modelData.newTheme.name;
                isSaveNewTheme = true;
            }

            var themeId = modelData.themeId;
            if (themeId === service.unsavedCustomThemeId) {
                if (!page) {
                    themeId = basedLookAndFeel.themeId ? basedLookAndFeel.themeId : service.currentSurvey.themeId;
                } else {
                    themeId = basedLookAndFeel.themeId ? basedLookAndFeel.themeId : service.currentSurvey.themeId;
                }
            }

            var lookAndFeelData = {
                surveyId: modelData.surveyId,
                layoutId: modelData.layoutId,
                themeId: themeId,
                theme: modelData.theme,
                isSaveNewTheme: isSaveNewTheme,
                rowVersion: modelData.rowVersion
            };

            if (modelData.theme.id === service.unsavedCustomThemeId) {
                lookAndFeelData.theme.id = null;
                lookAndFeelData.baseThemeId = modelData.theme.baseId;
            } else if (modelData.theme.type === service.customThemeType && modelData.theme.hasOwnProperty('baseId')) {
                lookAndFeelData.baseThemeId = modelData.theme.baseId;
            }
            return lookAndFeelData;

            function setDefaultValidThemeProperties() {
                if (!modelData.theme.font) modelData.theme.font = '';
                if (!modelData.theme.logo) modelData.theme.logo = '';
                if (!modelData.theme.backgroundImage) modelData.theme.backgroundImage = '';
                if (!modelData.theme.backgroundColor) modelData.theme.backgroundColor = '';
                if (!modelData.theme.questionTitleColor) modelData.theme.questionTitleColor = '';
                if (!modelData.theme.questionDescriptionColor) modelData.theme.questionDescriptionColor = '';
                if (!modelData.theme.questionContentColor) modelData.theme.questionContentColor = '';
                if (!modelData.theme.primaryButtonBackgroundColor) modelData.theme.primaryButtonBackgroundColor = '';
                if (!modelData.theme.primaryButtonColor) modelData.theme.primaryButtonColor = '';
                if (!modelData.theme.inputFieldBackgroundColor) modelData.theme.inputFieldBackgroundColor = '';
                if (!modelData.theme.inputFieldColor) modelData.theme.inputFieldColor = '';
                if (!modelData.theme.errorBackgroundColor) modelData.theme.errorBackgroundColor = '';
                if (!modelData.theme.errorColor) modelData.theme.errorColor = '';
                if (!modelData.theme.defaultButtonBackgroundColor) modelData.theme.defaultButtonBackgroundColor = '';
                if (!modelData.theme.defaultButtonColor) modelData.theme.defaultButtonColor = '';
            }

            function processInactiveOpacity() {
                modelData.theme.inactiveOpacity = Math.floor(modelData.theme.inactiveOpacity * 100) / 100;
            }

            function processBackgroundOpacity() {
                modelData.theme.backgroundOpacity = Math.floor(modelData.theme.backgroundOpacity * 100) / 100;
            }
        }

        function validateNewTheme(modelData, placeHolder) {
            if (modelData.newTheme.name === undefined || modelData.newTheme.name.trim() === '') {
                placeHolder.themeName.value = 'Please input theme name';
                placeHolder.themeName.valid = false;
                return false;
            }
            return true;
        }

        function updateModelByChangingTheme(model) {
            if (model.themeId === service.unsavedCustomThemeId) {
                if (!model.theme.hasOwnProperty('hasChanged') || !model.theme.hasChanged) {
                    var baseThemeId = model.theme.id;
                    var previousTheme = service.getThemeByCondition(model.themes, { name: 'id', value: baseThemeId });
                    service.upsertUnsavedCustomThemeIntoThemes(model.themes, previousTheme);
                    updateModel(model, model.themeId);
                    return;
                }
            }
            updateModel(model, model.themeId);
        }

        function updateModel(model, themeId) {
            for (var j = 0; j < model.themes.length; j++) {
                if (model.themes[j].id === themeId) {
                    model.theme = angular.copy(model.themes[j]);
                    break;
                }
            }
            model.fontSelectorData.font = model.theme.font;
        }

        function upsertUnsavedCustomThemeIntoThemes(themes, basedTheme) {
            var customTheme = angular.copy(basedTheme);
            customTheme.name = service.customThemeName;
            customTheme.type = service.customThemeType;
            customTheme.id = service.unsavedCustomThemeId;
            customTheme.baseId = basedTheme.id;

            themes.pop();
            themes.push(customTheme);
        }

        function initLookAndFeelPreviewModel() {
            return {
                surveyId: service.currentSurvey.id,
                temporaryPictures: []
            };
        }

        function updateThemesByCurrentTheme(model) {
            model.themes.forEach(function (theme, index) {
                if (model.theme.id === theme.id) {
                    model.themes[index] = angular.copy(model.theme);
                    return;
                }
            });
        }

        function setDefaultBackGroundSettings(modelTheme) {
            //TODO: Setup default for BackGround section in LookAndFeel Settings
            modelTheme.backgroundStyle = modelTheme.backgroundStyle || 'repeat';
        }
    }
})();