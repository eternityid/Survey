using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions.Services;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Surveys;
using System;
using System.Collections.Generic;
using System.IO;

namespace LearningPlatform.Domain.SurveyDesign.Services.Survey
{
    public class DuplicateSurveyService
    {
        private readonly PictureQuestionService _pictureQuestionService;
        private readonly InsertSurveyService _insertSurveyService;
        private readonly IThemeRepository _themeRepository;

        public DuplicateSurveyService(PictureQuestionService pictureQuestionService,
            InsertSurveyService insertSurveyService,
            IThemeRepository themeRepository)
        {
            _pictureQuestionService = pictureQuestionService;
            _insertSurveyService = insertSurveyService;
            _themeRepository = themeRepository;
        }

        public Domain.SurveyDesign.Survey DuplicateSurveyAndAssets(Domain.SurveyDesign.Survey survey, string newSurveyTitle = null)
        {
            var newSurvey = DuplicateSurvey(survey, newSurveyTitle);
            DuplicateSurveyAssets(survey, newSurvey);
            return newSurvey;
        }

        public Domain.SurveyDesign.Survey DuplicateSurvey(Domain.SurveyDesign.Survey survey, string newSurveyTitle = null)
        {
            if (survey == null) throw new ArgumentNullException();

            if (string.IsNullOrWhiteSpace(newSurveyTitle)) newSurveyTitle = $"Copy of {survey.SurveySettings.SurveyTitle}";

            var newSurvey = survey.DeepCopyByExpressionTree();
            newSurvey.AccessRights = new SurveyAccessRights();
            newSurvey.Status = SurveyStatus.New;
            newSurvey.Created = newSurvey.Modified = DateTime.Now;
            newSurvey.LastPublished = null;
            newSurvey.SurveySettings.SurveyTitle = newSurveyTitle;

            BuildSurveyThemes(newSurvey);

            OverrideSurveyObjectIds(survey, newSurvey);
            _insertSurveyService.InsertSurvey(newSurvey);

            return newSurvey;
        }

        public Domain.SurveyDesign.Survey DuplicateLibrarySurvey(Domain.SurveyDesign.Survey survey, string newSurveyTitle = null)
        {
            if (survey == null) throw new ArgumentNullException();

            if (string.IsNullOrWhiteSpace(newSurveyTitle)) newSurveyTitle = $"Copy of {survey.SurveySettings.SurveyTitle}";

            var newSurvey = survey.DeepCopyByExpressionTree();
            newSurvey.AccessRights = new SurveyAccessRights();
            newSurvey.Status = SurveyStatus.New;
            newSurvey.Created = newSurvey.Modified = DateTime.Now;
            newSurvey.LastPublished = null;
            newSurvey.SurveySettings.SurveyTitle = newSurveyTitle;

            BuildSurveyThemes(newSurvey);

            OverrideSurveyObjectIds(survey, newSurvey);
            _insertSurveyService.InsertLibrarySurvey(newSurvey);

            return newSurvey;
        }

        private void OverrideSurveyObjectIds(Domain.SurveyDesign.Survey sourceSurvey, Domain.SurveyDesign.Survey newSurvey)
        {
            var sourceNodeService = new NodeService(sourceSurvey);
            var sourceQuestionIds = sourceNodeService.GetQuestionIds();
            var sourceOptionIds = sourceNodeService.GetOptionIds();

            new OverrideSurveyObjectIdsService().Override(newSurvey);

            var newNodeService = new NodeService(newSurvey);
            var newQuestionIds = newNodeService.GetQuestionIds();
            var newOptionIds = newNodeService.GetOptionIds();

            var questionIdMap = new Dictionary<string, string>();
            var optionIdMap = new Dictionary<string, string>();

            for (var questionIndex = 0; questionIndex < sourceQuestionIds.Count; questionIndex++)
            {
                questionIdMap[sourceQuestionIds[questionIndex]] = newQuestionIds[questionIndex];
            }
            for (var optionIndex = 0; optionIndex < sourceOptionIds.Count; optionIndex++)
            {
                optionIdMap[sourceOptionIds[optionIndex]] = newOptionIds[optionIndex];
            }

            new MapSurveyObjectIdsService(questionIdMap, optionIdMap).Map(newSurvey);
        }

        private void DuplicateSurveyAssets(Domain.SurveyDesign.Survey sourceSurvey, Domain.SurveyDesign.Survey newSurvey)
        {
            var sourceQuestionAliasMap = new NodeService(sourceSurvey).GetQuestionAliasMap();
            var newQuestionAliasMap = new NodeService(newSurvey).GetQuestionAliasMap();

            foreach (var alias in sourceQuestionAliasMap.Keys)
            {
                var sourceQuestion = sourceQuestionAliasMap[alias];
                if (!_pictureQuestionService.IsPictureSelection(sourceQuestion)) continue;

                var sourceQuestionFolderPath = _pictureQuestionService.GetQuestionPictureFolder(sourceQuestion.SurveyId, sourceQuestion.Id);
                var sourceQuestionFolderInfo = new DirectoryInfo(sourceQuestionFolderPath);
                if (!sourceQuestionFolderInfo.Exists) continue;

                var newQuestion = newQuestionAliasMap[alias];
                var newQuestionFolderPath = _pictureQuestionService.GetQuestionPictureFolder(newQuestion.SurveyId, newQuestion.Id);
                Directory.CreateDirectory(newQuestionFolderPath);

                foreach (var file in sourceQuestionFolderInfo.GetFiles())
                {
                    File.Copy(file.FullName, newQuestionFolderPath + "/" + file.Name);
                }
            }
        }

        private void BuildSurveyThemes(Domain.SurveyDesign.Survey sourceSurvey)
        {
            if (sourceSurvey.CustomThemeId == null) return;

            var isUsingCustomTheme = sourceSurvey.ThemeId.Equals(sourceSurvey.CustomThemeId);
            var customTheme = _themeRepository.GetById(sourceSurvey.CustomThemeId);
            if (customTheme == null) return;

            var oldCustomThemeId = sourceSurvey.CustomThemeId;
            // Duplicate custom theme
            customTheme.Id = null;
            _themeRepository.Add(customTheme);

            sourceSurvey.CustomThemeId = customTheme.Id;
            if (isUsingCustomTheme) sourceSurvey.ThemeId = sourceSurvey.CustomThemeId;

            foreach (var node in sourceSurvey.TopFolder.ChildNodes)
            {
                var page = node as PageDefinition;
                if (page?.PageThemeId != null && page.PageThemeId == oldCustomThemeId) page.PageThemeId = customTheme.Id;
            }
        }
    }
}
