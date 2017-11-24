using LearningPlatform.Domain.Exceptions;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyLayout;
using LearningPlatform.Domain.SurveyPublishing;
using LearningPlatform.Domain.SurveyThemes;
using System.Collections.Generic;
using System.Collections.Specialized;

namespace LearningPlatform.Domain.SurveyDesign.Services.Survey
{
    public class LibrarySurveyService
    {
        private readonly SurveyExecutor _surveyExecutor;
        private readonly RequestInitializer _requestInitializer;

        private readonly ILayoutRepository _layoutRepository;
        private readonly IThemeRepository _themeRepository;
        private readonly IReadSurveyService _readSurveyService;

        public LibrarySurveyService(
            SurveyExecutor surveyExecutor,
            RequestInitializer requestInitializer,
            ILayoutRepository layoutRepository,
            IThemeRepository themeRepository,
            IReadSurveyService readSurveyService)
        {
            _surveyExecutor = surveyExecutor;
            _requestInitializer = requestInitializer;

            _layoutRepository = layoutRepository;
            _themeRepository = themeRepository;
            _readSurveyService = readSurveyService;
        }

        public SurveyExecution.Page BeginSurvey(string libraryId, string surveyId)
        {
            var surveyAndLayout = GetSurveyAndLayout(libraryId, surveyId);
            _requestInitializer.Initialize(surveyAndLayout, Direction.FirstPage);

            var page = _surveyExecutor.BeginOpenSurvey(surveyAndLayout);
            return page;
        }

        public SurveyExecution.Page Navigate(string libraryId, string surveyId, Direction direction, NameValueCollection nameValueCollection)
        {
            var surveyAndLayout = GetSurveyAndLayout(libraryId, surveyId);
            _requestInitializer.Initialize(surveyAndLayout, direction);

            var page = _surveyExecutor.Navigate(surveyAndLayout, direction, nameValueCollection);
            return page;
        }

        private SurveyAndLayout GetSurveyAndLayout(string libraryId, string surveyId)
        {
            var survey = _readSurveyService.GetFullLibrarySurvey(libraryId, surveyId);
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
                IsTesting = true,
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
                if (pageDefinition.PageThemeId != null) themeIds.Add(pageDefinition.PageThemeId);
            }

            return _themeRepository.GetByIds(themeIds);
        }

        private static void BuildPages(Node folder, List<PageDefinition> pages)
        {
            foreach (var node in folder.ChildNodes)
            {
                var childFolder = node as Folder;
                if (childFolder != null) BuildPages(childFolder, pages);
                var page = node as PageDefinition;
                if (page != null) pages.Add(page);
            }
        }

    }
}
