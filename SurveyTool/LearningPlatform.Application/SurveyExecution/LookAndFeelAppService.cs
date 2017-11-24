using System;
using System.Collections.Generic;
using LearningPlatform.Application.SurveyExecution.Models;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyLayout;
using LearningPlatform.Domain.SurveyPublishing;
using LearningPlatform.Domain.SurveyThemes;

namespace LearningPlatform.Application.SurveyExecution
{
    public class LookAndFeelAppService
    {
        private readonly ILayoutRepository _layoutRepository;
        private readonly IThemeRepository _themeRepository;

        public LookAndFeelAppService(ILayoutRepository layoutRepository, IThemeRepository themeRepository)
        {
            _layoutRepository = layoutRepository;
            _themeRepository = themeRepository;
        }

        public LayoutAndThemeModel MergeLayoutAndTheme(PageDefinition pageDefinition, SurveyAndLayout surveyAndLayout)
        {
            var theme = surveyAndLayout.GetPageTheme(pageDefinition.PageThemeId);
            var layout = surveyAndLayout.GetPageLayout(pageDefinition.PageLayoutId);
            return MergeLayoutAndTheme(layout, theme, pageDefinition.PageThemeOverrides);
        }

        public LayoutAndThemeModel MergeLayoutAndTheme(LookAndFeelByPageBindingModel lookAndFeelByPageBindingModel)
        {
            var layout = _layoutRepository.GetById(lookAndFeelByPageBindingModel.PageLayoutId ?? lookAndFeelByPageBindingModel.SurveyLayoutId);
            var theme = _themeRepository.GetById(lookAndFeelByPageBindingModel.PageThemeId ?? lookAndFeelByPageBindingModel.SurveyThemeId);
            return MergeLayoutAndTheme(layout, theme, lookAndFeelByPageBindingModel.OverridePageTheme);
        }

        private LayoutAndThemeModel MergeLayoutAndTheme(Layout layout, Theme theme,
            Theme pageThemeOverrides)
        {
            if (pageThemeOverrides != null)
            {
                MergePropertiesIntoTheme(theme, pageThemeOverrides);
            }

            return new LayoutAndThemeModel
            {
                Layout = layout,
                Theme = theme,
                OverrideTheme = pageThemeOverrides
            };
        }

        //TODO: Should this be moved into a service (not app service)?
        private void MergePropertiesIntoTheme(Theme currentTheme, Theme overridePropertiesOfTheme)
        {
            Type type = typeof(Theme);
            string[] ignore = { "Id", "Name", "IsDefault", "IsPageOverride", "Type", "UserId", "RowVersion", "BackgroundStyleName", "IsSystemType", "IsCustomType", "IsUserType" };
            List<string> ignoreList = new List<string>(ignore);

            foreach (System.Reflection.PropertyInfo propertyInfo in type.GetProperties(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance))
            {
                if (!ignoreList.Contains(propertyInfo.Name))
                {
                    object currentValue = type.GetProperty(propertyInfo.Name).GetValue(currentTheme, null);
                    object overrideValue = type.GetProperty(propertyInfo.Name).GetValue(overridePropertiesOfTheme, null);

                    if (currentValue != overrideValue && overrideValue != null && (currentValue == null || !currentValue.Equals(overrideValue)))
                    {
                        type.GetProperty(propertyInfo.Name).SetValue(currentTheme, overrideValue);
                    }
                }
            }
        }

    }
}