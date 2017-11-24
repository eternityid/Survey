using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Page;
using LearningPlatform.Domain.SurveyThemes;
using System;

namespace LearningPlatform.Domain.SurveyDesign
{
    public class LookAndFeelService
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly IThemeRepository _themeRepository;
        private readonly ThemeService _themeService;
        private readonly UploadThemeService _uploadThemeService;
        private readonly ReadPageService _readPageService;
        private readonly INodeRepository _nodeRepository;

        public LookAndFeelService(ISurveyRepository surveyRepository,
            IThemeRepository themeRepository,
            ThemeService themeService,
            UploadThemeService uploadThemeService,
            ReadPageService readPageService,
            INodeRepository nodeRepository)
        {
            _surveyRepository = surveyRepository;
            _themeRepository = themeRepository;
            _themeService = themeService;
            _uploadThemeService = uploadThemeService;
            _readPageService = readPageService;
            _nodeRepository = nodeRepository;
        }

        public bool IsThemeChanged(Survey survey, Theme originalTheme, Theme submittedTheme, string baseThemeId)
        {
            return survey.ThemeId != submittedTheme.Id
                || submittedTheme.Id == null
                || !_themeService.IsEqual(originalTheme, submittedTheme)
                || (submittedTheme.Type == ThemeType.Custom && submittedTheme.Id != null && baseThemeId != null);
        }

        public void UpdateTheme(
            Survey survey, Theme originalTheme, Theme submittedTheme,
            string currentUserId, string baseThemeId, string libraryId)
        {
            submittedTheme.UserId = currentUserId;
            switch (submittedTheme.Type)
            {
                case ThemeType.System:
                    UpdateSurveyTheme(survey, submittedTheme); //Don't need to check theme change to reduce complexity
                    break;
                case ThemeType.User:
                    _themeService.UpdateThemeProperties(originalTheme, submittedTheme);
                    UpdateSurveyTheme(survey, submittedTheme);
                    break;
                case ThemeType.Custom:
                    _themeService.UpdateThemeProperties(originalTheme, submittedTheme);
                    UpdateSurveyTheme(survey, submittedTheme);
                    if (baseThemeId != null)
                    {
                        CopyThemeImagesToAzure(submittedTheme, _themeService.GetTheme(baseThemeId), libraryId);
                    }
                    break;
            }
        }

        public void UseNewUserTheme(
            Survey survey, Theme originalTheme, Theme submittedTheme,
            string currentUserId, string baseThemeId, string libraryId)
        {
            if (_themeService.IsExistsThemeName(submittedTheme.Name, currentUserId))
            {
                throw new Exception("Duplicated theme name");
            }

            var newUserTheme = submittedTheme;
            newUserTheme.UserId = currentUserId;
            newUserTheme.Type = ThemeType.User;
            ToAddNewTheme(newUserTheme, originalTheme, baseThemeId, libraryId);

            UpdateSurveyTheme(survey, newUserTheme);
        }

        public void UseNewCustomTheme(
            Survey survey, Theme originalTheme, Theme submittedTheme,
            string currentUserId, string baseThemeId, string libraryId)
        {
            var newCustomTheme = submittedTheme;
            newCustomTheme.UserId = currentUserId;
            newCustomTheme.Type = ThemeType.Custom;
            ToAddNewTheme(newCustomTheme, originalTheme, baseThemeId, libraryId);

            UpdateSurveyTheme(survey, newCustomTheme);
        }

        private void ToAddNewTheme(Theme newTheme, Theme originalTheme, string baseThemeId, string libraryId)
        {
            newTheme.IsDefault = false;
            newTheme.Id = null;

            _themeService.AddTheme(newTheme);
            var baseTheme = baseThemeId != null ?
                _themeService.GetTheme(baseThemeId) :
                originalTheme;
            CopyThemeImagesToAzure(newTheme, baseTheme, libraryId);
        }

        private void CopyThemeImagesToAzure(Theme newTheme, Theme baseTheme, string libraryId)
        {
            var logo = newTheme.Logo;
            var backgroundImage = newTheme.BackgroundImage;

            _uploadThemeService.CopyImagesBetweenThemes(baseTheme, newTheme, libraryId);

            if (logo != newTheme.Logo || backgroundImage != newTheme.BackgroundImage)
            {
                _themeRepository.Update(newTheme);
            }
        }

        public void UpdateLayout(Survey surveyInfo, string layoutId)
        {
            surveyInfo.LayoutId = layoutId;
            surveyInfo.Modified = DateTime.Now;
            _surveyRepository.Update(surveyInfo);
        }

        private void UpdateSurveyTheme(Survey surveyInfo, Theme modifiedTheme)
        {
            surveyInfo.ThemeId = modifiedTheme.Id;
            if (modifiedTheme.Type == ThemeType.Custom)
            {
                surveyInfo.CustomThemeId = modifiedTheme.Id;
            }
            surveyInfo.Modified = DateTime.Now;
            _surveyRepository.Update(surveyInfo);
        }

        public void ResetPageThemeId(string surveyId, string currentPageThemeId)
        {
            var pages = _readPageService.GetPagesBySurveyIdAndThemeId(surveyId, currentPageThemeId);
            foreach (var page in pages)
            {
                page.PageThemeId = null;
                _nodeRepository.Update(page);
            }
        }
    }
}