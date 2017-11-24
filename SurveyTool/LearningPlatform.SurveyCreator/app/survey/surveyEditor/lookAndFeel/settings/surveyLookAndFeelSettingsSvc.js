(function () {
    angular.module('svt').service('surveyLookAndFeelSettingsSvc', SurveyLookAndFeelSettingsSvc);

    SurveyLookAndFeelSettingsSvc.$inject = ['lookAndFeelSettingsSvc'];

    function SurveyLookAndFeelSettingsSvc(lookAndFeelSettingsSvc) {
        var service = {
            initSurveyLookAndFeelPreviewModel: initSurveyLookAndFeelPreviewModel,
            ensureHaveCustomTheme: ensureHaveCustomTheme,
            getLookAndFeelBindingModel: getLookAndFeelBindingModel,
            switchToSurveyCustomTheme: switchToSurveyCustomTheme
        };
        return service;

        function initSurveyLookAndFeelPreviewModel(model) {
            var previewModel = lookAndFeelSettingsSvc.initLookAndFeelPreviewModel();
            previewModel.layoutId = model.layoutId;

            if (model.themeId === lookAndFeelSettingsSvc.unsavedCustomThemeId) {
                previewModel.themeId = model.theme.hasOwnProperty('baseId') && model.theme.baseId !== undefined ?
                    model.theme.baseId : lookAndFeelSettingsSvc.currentSurvey.themeId;
            } else if (model.theme.type === lookAndFeelSettingsSvc.customThemeType) {
                previewModel.themeId = model.theme.hasOwnProperty('baseId') && model.theme.baseId !== undefined ?
                    model.theme.baseId : model.theme.id;
            } else {
                previewModel.themeId = model.themeId;
            }

            previewModel.backgroundImage = model.theme.backgroundImage;
            previewModel.logo = model.theme.logo;
            return previewModel;
        }

        function ensureHaveCustomTheme(themes) {
            var existingCustomTheme = lookAndFeelSettingsSvc.getThemeByCondition(themes, { name: 'type', value: lookAndFeelSettingsSvc.customThemeType });
            if (existingCustomTheme) return;

            var defaultCustomTheme = angular.copy(themes[0]);
            defaultCustomTheme.name = lookAndFeelSettingsSvc.customThemeName;
            defaultCustomTheme.type = lookAndFeelSettingsSvc.customThemeType;
            defaultCustomTheme.id = lookAndFeelSettingsSvc.unsavedCustomThemeId;
            defaultCustomTheme.baseId = themes[0].id;
            defaultCustomTheme.hasChanged = false;
            themes.push(defaultCustomTheme);
        }

        function getLookAndFeelBindingModel(layouts, themes) {
            var model = lookAndFeelSettingsSvc.initModelData();
            model.layouts = layouts;
            model.themes = themes;

            model.layoutId = lookAndFeelSettingsSvc.currentSurvey.layoutId;
            model.themeId = lookAndFeelSettingsSvc.currentSurvey.themeId;
            model.theme = lookAndFeelSettingsSvc.getThemeByCondition(themes, { name: 'id', value: model.themeId });

            model.fontSelectorData.font = model.theme.font;

            return model;
        }

        function switchToSurveyCustomTheme(model) {
            var currentCustomTheme = model.themes[model.themes.length - 1];
            var id = currentCustomTheme.id;
            currentCustomTheme = angular.copy(model.theme);
            currentCustomTheme.name = lookAndFeelSettingsSvc.customThemeName;
            currentCustomTheme.type = lookAndFeelSettingsSvc.customThemeType;
            currentCustomTheme.id = id;
            currentCustomTheme.baseId = model.theme.id;

            model.themes.pop();
            model.themes.push(currentCustomTheme);

            model.theme = angular.copy(model.themes[model.themes.length - 1]);
            model.themeId = model.theme.id;
        }
    }
})();