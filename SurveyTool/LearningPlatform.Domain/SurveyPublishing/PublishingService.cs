using Autofac;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Exceptions;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;
using LearningPlatform.Domain.SurveyLayout;
using LearningPlatform.Domain.SurveyThemes;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyPublishing
{
    public class PublishingService
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly ILayoutRepository _layoutRepository;
        private readonly ISurveyVersionRepository _surveyVersionRepository;
        private readonly IReadSurveyService _readSurveyService;
        private readonly JsonSerializerSettings _serializerSettings;
        private readonly IThemeRepository _themeRepository;

        public PublishingService(ISurveyRepository surveyRepository,
            ILayoutRepository layoutRepository,
            ISurveyVersionRepository surveyVersionRepository,
            IThemeRepository themeRepository, IComponentContext componentContext,
            IReadSurveyService readSurveyService)
        {
            _surveyRepository = surveyRepository;
            _layoutRepository = layoutRepository;
            _surveyVersionRepository = surveyVersionRepository;
            _serializerSettings = JsonSerializerSettingsFactory.Create(componentContext);
            _themeRepository = themeRepository;
            _readSurveyService = readSurveyService;
        }


        public void Publish(string surveyId)
        {
            var surveyAndLayout = GetUnpublishedVersion(surveyId);
            var surveyVersion = new SurveyVersion
            {
                SurveyId = surveyId,
                SerializedString = JsonConvert.SerializeObject(surveyAndLayout, Formatting.Indented, _serializerSettings)
            };
            _surveyVersionRepository.Add(surveyVersion);
            _surveyRepository.UpdateLastPublished(surveyId);
        }

        public SurveyAndLayout GetLatestVersion(string surveyId)
        {
            SurveyVersion surveyVersion = GetSurveyVersion(surveyId);
            return JsonConvert.DeserializeObject<SurveyAndLayout>(surveyVersion.SerializedString, _serializerSettings);
        }

        public SurveyAndLayout GetUnpublishedVersion(string surveyId)
        {
            var survey = _readSurveyService.GetFullSurvey(surveyId);
            if (survey == null) throw new EntityNotFoundException($"Survey {surveyId} not found"); //TODO: create own exception

            var layout = _layoutRepository.GetById(survey.LayoutId);
            if (layout == null) throw new EntityNotFoundException($"Layout {survey.LayoutId} not found"); //TODO: create own exception

            var theme = _themeRepository.GetById(survey.ThemeId);
            if (theme == null) throw new EntityNotFoundException($"Theme {survey.ThemeId} not found"); //TODO: create own exception

            var pageDefinitions = new List<PageDefinition>();
            BuildPages(survey.TopFolder, pageDefinitions);
            return new SurveyAndLayout
            {
                Survey = survey,
                Layout = layout,
                Theme = theme,
                PageLayouts = GetPageLayouts(pageDefinitions),
                PageThemes = GetPageThemes(pageDefinitions)
            };
        }

        private IList<Layout> GetPageLayouts(List<PageDefinition> pageDefinitions)
        {
            var layoutIds = new HashSet<string>();
            foreach (var pageDefinition in pageDefinitions)
            {
                if (pageDefinition.PageLayoutId != null) layoutIds.Add(pageDefinition.PageLayoutId);
            }

            return _layoutRepository.GetByIds(layoutIds);
        }

        private IList<Theme> GetPageThemes(List<PageDefinition> pageDefinitions)
        {
            var themeIds = new HashSet<string>();
            foreach (var pageDefinition in pageDefinitions)
            {
                if (pageDefinition.PageThemeId!=null) themeIds.Add(pageDefinition.PageThemeId);
            }

            return _themeRepository.GetByIds(themeIds);
        }


        private static void BuildPages(Folder folder, List<PageDefinition> pages)
        {
            foreach (var node in folder.ChildNodes)
            {
                var childFolder = node as Folder;
                if (childFolder != null)
                {
                    BuildPages(childFolder, pages);
                }
                var page = node as PageDefinition;
                if(page!=null) pages.Add(page);
            }
        }

        public SurveyAndLayout GetSurveyAndLayout(string surveyId, bool isTesting)
        {
            var surveyAndLayout = isTesting ? GetUnpublishedVersion(surveyId) : GetLatestVersion(surveyId);
            surveyAndLayout.IsTesting = isTesting;

            return surveyAndLayout;
        }

        private SurveyVersion GetSurveyVersion(string surveyId)
        {
            var surveyVersion = _surveyVersionRepository.GetLatest(surveyId);
            if (surveyVersion == null) throw new EntityNotFoundException($"Survey version:{surveyId} not found."); //TODO: create own exception
            return surveyVersion;
        }

        public bool IsPublished(string surveyId)
        {
            return _surveyVersionRepository.GetLatest(surveyId) != null;
        }
    }
}
