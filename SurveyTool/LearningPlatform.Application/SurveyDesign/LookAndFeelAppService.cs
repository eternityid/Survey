using LearningPlatform.Application.SurveyDesign.Dtos;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyThemes;
using System;

namespace LearningPlatform.Application.SurveyDesign
{
    public class LookAndFeelAppService
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly LookAndFeelService _lookAndFeelService;
        private readonly ThemeService _themeService;

        public LookAndFeelAppService(ISurveyRepository surveyRepository,
            LookAndFeelService lookAndFeelService,
            ThemeService themeService)
        {
            _surveyRepository = surveyRepository;
            _lookAndFeelService = lookAndFeelService;
            _themeService = themeService;
        }

        public void UpdateLookAndFeel(UpsertThemeDto upsertThemeModel, Survey survey, string currentUserId, string libraryId)
        {
            var originalTheme = _themeService.GetTheme(upsertThemeModel.Theme.Id ?? upsertThemeModel.BaseThemeId);
            if (originalTheme == null)
            {
                throw new Exception($"Theme {upsertThemeModel.Theme.Id} not found");
            }

            if (survey.LayoutId != upsertThemeModel.LayoutId)
            {
                _lookAndFeelService.UpdateLayout(survey, upsertThemeModel.LayoutId);
            }

            if (_lookAndFeelService.IsThemeChanged(survey, originalTheme, upsertThemeModel.Theme, upsertThemeModel.BaseThemeId)
                || upsertThemeModel.IsSaveNewTheme)
            {
                string originalSurveyThemeId = survey.ThemeId;

                if (upsertThemeModel.IsSaveNewTheme)
                {
                    _lookAndFeelService.UseNewUserTheme(
                        survey, originalTheme, upsertThemeModel.Theme,
                        currentUserId, upsertThemeModel.BaseThemeId, libraryId);
                }
                else if (upsertThemeModel.Theme.Id == null)
                {
                    _lookAndFeelService.UseNewCustomTheme(
                        survey, originalTheme, upsertThemeModel.Theme,
                        currentUserId, upsertThemeModel.BaseThemeId, libraryId);
                }
                else
                {
                    _lookAndFeelService.UpdateTheme(
                        survey, originalTheme, upsertThemeModel.Theme,
                        currentUserId, upsertThemeModel.BaseThemeId, libraryId);
                }

                if (originalSurveyThemeId != survey.ThemeId)
                {
                    _lookAndFeelService.ResetPageThemeId(survey.Id, originalSurveyThemeId);
                }
            }
        }
    }
}