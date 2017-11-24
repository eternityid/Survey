(function () {
    angular.module('svt').service('pageLookAndFeelSettingsSvc', PageLookAndFeelSettingsSvc);

    PageLookAndFeelSettingsSvc.$inject = ['lookAndFeelSettingsSvc'];

    function PageLookAndFeelSettingsSvc(lookAndFeelSettingsSvc) {
        var service = {
            initPageLookAndFeelPreviewModel: initPageLookAndFeelPreviewModel,
            parsePageThemeOverrides: parsePageThemeOverrides,
            detectTrackingChanges: detectTrackingChanges,
            getBasedThemePerPage: getBasedThemePerPage,
            isPageLookAndFeelOverridden: isPageLookAndFeelOverridden,
            getLookAndFeelBindingModel: getLookAndFeelBindingModel,
            switchToPageCustomTheme: switchToPageCustomTheme
        };
        return service;

        function initPageLookAndFeelPreviewModel(basedLookAndFeel, model, currentPage) {
            var previewModel = lookAndFeelSettingsSvc.initLookAndFeelPreviewModel();
            previewModel.surveyLayoutId = lookAndFeelSettingsSvc.currentSurvey.layoutId;
            previewModel.surveyThemeId = lookAndFeelSettingsSvc.currentSurvey.themeId;
            previewModel.backgroundImage = basedLookAndFeel.theme.backgroundImage;
            previewModel.logo = basedLookAndFeel.theme.logo;

            previewModel.pageId = currentPage.id;
            previewModel.pageTitle = currentPage.title.items[0].text;
            previewModel.pageDescription = currentPage.description.items[0].text;
            previewModel.orderType = currentPage.OrderType;
            previewModel.pageLayoutId = basedLookAndFeel.layoutId;
            previewModel.pageThemeId = basedLookAndFeel.themeId;
            previewModel.overridePageTheme = parsePageThemeOverrides(model, currentPage);
            return previewModel;
        }

        function parsePageThemeOverrides(model, page) {
            var theme = angular.copy(model.theme);
            delete theme.baseId;
            var pageThemeId = model.themeId;
            if (pageThemeId === lookAndFeelSettingsSvc.unsavedCustomThemeId) {
                pageThemeId = page.pageThemeId !== null ? page.pageThemeId : lookAndFeelSettingsSvc.currentSurvey.themeId;
            }
            var pageTheme = lookAndFeelSettingsSvc.getThemeByCondition(model.themes, { name: 'id', value: pageThemeId });
            if (pageTheme === null || (pageTheme.type === lookAndFeelSettingsSvc.customThemeType && lookAndFeelSettingsSvc.savedCustomTheme)) {
                pageTheme = lookAndFeelSettingsSvc.savedCustomTheme;
            }

            var haveChanges = false;
            var ignoredProperties = ['type', 'isDefault', 'isSystemType', 'isCustomType', 'isUserType', 'isPageOverride', 'id', 'name'];
            for (var property in theme) {
                if (!theme.hasOwnProperty(property)) continue;
                if (property.indexOf('$') === 0) {
                    delete theme[property];
                    continue;
                }
                if (theme[property] !== pageTheme[property]) {
                    if (ignoredProperties.indexOf(property) < 0) {
                        haveChanges = true;
                    }
                } else {
                    theme[property] = null;
                }
            }

            theme.id = page.pageThemeOverrides ? page.pageThemeOverrides.id : 0;
            theme.isPageOverride = true;
            theme.isDefault = false;
            theme.type = lookAndFeelSettingsSvc.customThemeType;

            return haveChanges ? theme : null;
        }



        function detectTrackingChanges(basedLookAndFeel, model) {
            var aTheme = basedLookAndFeel.theme,
                bTheme = model.theme;

            aTheme.backgroundStyle = aTheme.backgroundStyle ? aTheme.backgroundStyle : bTheme.backgroundStyle;

            return {
                layoutId: lookAndFeelSettingsSvc.currentSurvey.layoutId !== model.layoutId,
                themeId: lookAndFeelSettingsSvc.currentSurvey.themeId !== model.themeId,
                font: aTheme.font !== bTheme.font,
                backgroundImage: aTheme.backgroundImage !== bTheme.backgroundImage,
                logo: aTheme.logo !== bTheme.logo,
                isRepeatBackground: aTheme.isRepeatBackground !== bTheme.isRepeatBackground,
                backgroundStyle: aTheme.backgroundStyle !== bTheme.backgroundStyle,
                backgroundColor: aTheme.backgroundColor !== bTheme.backgroundColor,
                errorBackgroundColor: aTheme.errorBackgroundColor !== bTheme.errorBackgroundColor,
                errorColor: aTheme.errorColor !== bTheme.errorColor,
                questionTitleColor: aTheme.questionTitleColor !== bTheme.questionTitleColor,
                questionDescriptionColor: aTheme.questionDescriptionColor !== bTheme.questionDescriptionColor,
                questionContentColor: aTheme.questionContentColor !== bTheme.questionContentColor,
                inputFieldBackgroundColor: aTheme.inputFieldBackgroundColor !== bTheme.inputFieldBackgroundColor,
                inputFieldColor: aTheme.inputFieldColor !== bTheme.inputFieldColor,
                primaryButtonBackgroundColor: aTheme.primaryButtonBackgroundColor !== bTheme.primaryButtonBackgroundColor,
                primaryButtonColor: aTheme.primaryButtonColor !== bTheme.primaryButtonColor,
                defaultButtonBackgroundColor: aTheme.defaultButtonBackgroundColor !== bTheme.defaultButtonBackgroundColor,
                defaultButtonColor: aTheme.defaultButtonColor !== bTheme.defaultButtonColor,
                pageContainerBackgroundColor: aTheme.pageContainerBackgroundColor !== bTheme.pageContainerBackgroundColor,
                pageContainerBackgroundOpacity: aTheme.pageContainerBackgroundOpacity !== bTheme.pageContainerBackgroundOpacity,
                inactiveOpacity: aTheme.inactiveOpacity !== bTheme.inactiveOpacity
            };
        }

        function getBasedThemePerPage(model, page) {
            var themeId = model.themeId;
            if (model.themeId === lookAndFeelSettingsSvc.unsavedCustomThemeId) {
                themeId = page.pageThemeId ? page.pageThemeId : lookAndFeelSettingsSvc.currentSurvey.themeId;
            }
            return lookAndFeelSettingsSvc.getThemeByCondition(model.themes, { name: 'id', value: themeId });
        }

        function isPageLookAndFeelOverridden(page) {
            var pageLayoutChanged = page.pageLayoutId !== null && page.pageLayoutId !== lookAndFeelSettingsSvc.currentSurvey.layoutId,
                    pageThemeChanged = page.pageThemeId !== null && page.pageThemeId !== lookAndFeelSettingsSvc.currentSurvey.themeId,
                    pageThemeOveridden = page.pageThemeOverrides !== null;
            return pageLayoutChanged || pageThemeChanged || pageThemeOveridden;
        }

        function getLookAndFeelBindingModel(page, layouts, themes) {
            var model = lookAndFeelSettingsSvc.initModelData();
            model.layouts = layouts;
            model.themes = themes;

            model.layoutId = page.pageLayoutId ? page.pageLayoutId : lookAndFeelSettingsSvc.currentSurvey.layoutId;
            model.themeId = page.pageThemeId ? page.pageThemeId : lookAndFeelSettingsSvc.currentSurvey.themeId;
            model.theme = lookAndFeelSettingsSvc.getThemeByCondition(themes, { name: 'id', value: model.themeId });
            if (page && page.pageThemeOverrides) {
                model.theme = mergeTheme(model.theme, page.pageThemeOverrides);
                model.theme.id = lookAndFeelSettingsSvc.unsavedCustomThemeId;
                model.themeId = lookAndFeelSettingsSvc.unsavedCustomThemeId;

                var surveyCustomTheme = lookAndFeelSettingsSvc.getThemeByCondition(model.themes, { name: 'type', value: lookAndFeelSettingsSvc.customThemeType });
                var pageCustomTheme = angular.copy(model.theme);
                var backgroundImageCustom = surveyCustomTheme ? surveyCustomTheme.backgroundImage : pageCustomTheme.backgroundImage;
                var logoCustom = surveyCustomTheme ? surveyCustomTheme.logo : pageCustomTheme.logo;

                pageCustomTheme.name = lookAndFeelSettingsSvc.customThemeName;
                pageCustomTheme.type = lookAndFeelSettingsSvc.customThemeType;
                pageCustomTheme.backgroundImage = page.pageThemeOverrides.backgroundImage === null ? backgroundImageCustom : page.pageThemeOverrides.backgroundImage;
                pageCustomTheme.logo = page.pageThemeOverrides.logo === null ? logoCustom : page.pageThemeOverrides.logo;

                model.themes = model.themes.filter(function (themeItem) {
                    return themeItem.type !== lookAndFeelSettingsSvc.customThemeType;
                });
                model.themes.push(pageCustomTheme);
            }
            model.fontSelectorData.font = model.theme.font;

            return model;

            function mergeTheme(orginalTheme, theme) {
                for (var property in orginalTheme) {
                    if (orginalTheme.hasOwnProperty(property) && theme.hasOwnProperty(property) && theme[property] !== null) {
                        orginalTheme[property] = theme[property];
                    }
                }
                return orginalTheme;
            }
        }

        function switchToPageCustomTheme(model) {
            lookAndFeelSettingsSvc.upsertUnsavedCustomThemeIntoThemes(model.themes, model.theme);
            var currentCustomTheme = model.themes[model.themes.length - 1];
            model.theme = angular.copy(currentCustomTheme);
            model.theme.baseId = model.theme.id;
            model.themeId = currentCustomTheme.id;
        }
    }
})();