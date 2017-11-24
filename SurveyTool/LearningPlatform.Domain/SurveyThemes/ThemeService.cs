using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyThemes
{
    public class ThemeService
    {
        private readonly IThemeRepository _themeRepository;
        private readonly UploadThemeService _uploadThemeService;

        public ThemeService(IThemeRepository themeRepository,
            UploadThemeService uploadThemeService)
        {
            _themeRepository = themeRepository;
            _uploadThemeService = uploadThemeService;
        }

        public void DeleteCustomTheme(string themeId)
        {
            var theme = GetTheme(themeId);
            if (theme != null && theme.IsCustomType)
            {
                _themeRepository.Delete(themeId);
                _uploadThemeService.DeleteThemeFolder(themeId);
            }
        }

        public Theme GetTheme(string themeId)
        {
            return _themeRepository.GetById(themeId);
        }

        public List<Theme> GetSystemThemes()
        {
            return _themeRepository.GetByType(ThemeType.System);
        }

        public void AddTheme(Theme theme)
        {
            _themeRepository.Add(theme);
        }

        public void UpdateThemeProperties(Theme theme, Theme themeModel)
        {
            var updatedThemeItem = _themeRepository.GetById(theme.Id);

            updatedThemeItem.Name = themeModel.Name;
            updatedThemeItem.Font = themeModel.Font;
            updatedThemeItem.Logo = themeModel.Logo;
            updatedThemeItem.BackgroundImage = themeModel.BackgroundImage;
            updatedThemeItem.InactiveOpacity = themeModel.InactiveOpacity;
            updatedThemeItem.PageContainerBackgroundColor = themeModel.PageContainerBackgroundColor;
            updatedThemeItem.PageContainerBackgroundOpacity = themeModel.PageContainerBackgroundOpacity;
            updatedThemeItem.BackgroundColor = themeModel.BackgroundColor;
            updatedThemeItem.QuestionTitleColor = themeModel.QuestionTitleColor;
            updatedThemeItem.QuestionDescriptionColor = themeModel.QuestionDescriptionColor;
            updatedThemeItem.QuestionContentColor = themeModel.QuestionContentColor;
            updatedThemeItem.ErrorColor = themeModel.ErrorColor;
            updatedThemeItem.ErrorBackgroundColor = themeModel.ErrorBackgroundColor;
            updatedThemeItem.PrimaryButtonColor = themeModel.PrimaryButtonColor;
            updatedThemeItem.PrimaryButtonBackgroundColor = themeModel.PrimaryButtonBackgroundColor;
            updatedThemeItem.InputFieldBackgroundColor = themeModel.InputFieldBackgroundColor;
            updatedThemeItem.InputFieldColor = themeModel.InputFieldColor;
            updatedThemeItem.BackgroundStyle = themeModel.BackgroundStyle;
            updatedThemeItem.DefaultButtonBackgroundColor = themeModel.DefaultButtonBackgroundColor;
            updatedThemeItem.DefaultButtonColor = themeModel.DefaultButtonColor;

            _themeRepository.Update(updatedThemeItem);
        }

        public bool IsEqual(Theme source, Theme destination)
        {
            //TODO need to refactor. Sample write toString function

            if (source == null || destination == null) return true;
            if (source.Name == destination.Name
                && source.Logo == destination.Logo
                && source.BackgroundImage == destination.BackgroundImage
                && source.Font == destination.Font
                && source.InactiveOpacity.Equals(destination.InactiveOpacity)
                && source.BackgroundColor == destination.BackgroundColor
                && source.PageContainerBackgroundOpacity.Equals(destination.PageContainerBackgroundOpacity)
                && source.PageContainerBackgroundColor == destination.PageContainerBackgroundColor
                && source.ErrorColor == destination.ErrorColor
                && source.ErrorBackgroundColor == destination.ErrorBackgroundColor
                && source.QuestionContentColor == destination.QuestionContentColor
                && source.QuestionDescriptionColor == destination.QuestionDescriptionColor
                && source.QuestionTitleColor == destination.QuestionTitleColor
                && source.PrimaryButtonBackgroundColor == destination.PrimaryButtonBackgroundColor
                && source.PrimaryButtonColor == destination.PrimaryButtonColor
                && source.InputFieldBackgroundColor == destination.InputFieldBackgroundColor
                && source.InputFieldColor == destination.InputFieldColor
                && source.DefaultButtonBackgroundColor == destination.DefaultButtonBackgroundColor
                && source.DefaultButtonColor == destination.DefaultButtonColor
                && source.BackgroundStyleName == destination.BackgroundStyleName)

            {
                return true;
            }
            return false;
        }

        public bool IsExistsThemeName(string themeName, string userId)
        {
            List<Theme> systemThemes = GetSystemThemes();
            List<Theme> userThemes = _themeRepository.GetByUserId(userId);

            foreach (var theme in systemThemes)
            {
                if (theme.Name.Equals(themeName)) return true;
            }
            foreach (var theme in userThemes)
            {
                if (theme.Name.Equals(themeName)) return true;
            }
            return false;
        }

        public void UpdateThemeForPage(PageDefinition originalPage, PageDefinition submittedPage,
            Theme newUserTheme, string currentUserId)
        {
            var pageTheme = _themeRepository.GetById(submittedPage.PageThemeId);

            if (newUserTheme != null)
            {
                newUserTheme.Type = ThemeType.User;
                newUserTheme.IsDefault = false;
                newUserTheme.Id = null;
                newUserTheme.UserId = currentUserId;
                newUserTheme.IsPageOverride = false;

                AddTheme(newUserTheme);
                submittedPage.PageThemeId = newUserTheme.Id;
                submittedPage.PageThemeOverrides = null;
                return;
            }

            if (submittedPage.PageThemeOverrides != null)
            {
                if (originalPage.PageThemeOverrides == null)
                {
                    submittedPage.PageThemeOverrides.Id = ObjectId.GenerateNewId().ToString();
                }
                else
                {
                    submittedPage.PageThemeOverrides.Id = originalPage.PageThemeOverrides.Id == null ?
                        ObjectId.GenerateNewId().ToString() :
                        originalPage.PageThemeOverrides.Id;
                }
            }
        }
    }
}
