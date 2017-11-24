using LearningPlatform.Application.SurveyExecution.Models;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyLayout;
using LearningPlatform.Domain.SurveyPublishing;
using System.Collections.Specialized;
using System.Linq;

namespace LearningPlatform.Application.SurveyExecution
{
    public class PagePreviewAppService
    {
        private readonly IRequestObjectProvider<IRequestContext> _requestContextProvider;
        private readonly RequestContextFactory _requestContextFactory;
        private readonly PageFactory _pageFactory;
        private readonly PublishingService _publishingService;


        private readonly ISurveyRepository _surveyRepository;
        private readonly INodeRepository _nodeRepository;
        private readonly ILayoutRepository _layoutRepository;
        private readonly IThemeRepository _themeRepository;
        private readonly Domain.SurveyDesign.SurveyDesign.Factory _surveyDesignFactory;
        private readonly MapperService _mapper;

        public PagePreviewAppService(IRequestObjectProvider<IRequestContext> requestContextProvider,
            RequestContextFactory requestContextFactory,
            PageFactory pageFactory,
            PublishingService publishingService,
            ISurveyRepository surveyRepository,
            INodeRepository nodeRepository,
            ILayoutRepository layoutRepository,
            IThemeRepository themeRepository,
            Domain.SurveyDesign.SurveyDesign.Factory surveyDesignFactory,
            MapperService mapper)
        {
            _requestContextProvider = requestContextProvider;
            _requestContextFactory = requestContextFactory;
            _pageFactory = pageFactory;
            _publishingService = publishingService;

            _surveyRepository = surveyRepository;
            _nodeRepository = nodeRepository;
            _layoutRepository = layoutRepository;
            _themeRepository = themeRepository;
            _surveyDesignFactory = surveyDesignFactory;
            _mapper = mapper;
        }

        public Page Preview(string surveyId, PageDefinition pageDefinition, string langauge)
        {
            var surveyAndLayout = _publishingService.GetUnpublishedVersion(surveyId);
            _requestContextProvider.Set(_requestContextFactory.Create(surveyAndLayout, new Respondent { Language = langauge }, Direction.FirstPage));

            var questions =
                pageDefinition.QuestionDefinitions.Select(questionDefinition => _mapper.Map<Question>(questionDefinition))
                    .ToList();

            foreach (var question in questions)
            {
                question.Initialize(new NameValueCollection());
            }

            var page = _pageFactory.CreateOutgoingPage(pageDefinition, Direction.FirstPage, questions, NavigationButtons.PreviousAndNext);
            page.DisplayProgressBar = false;
            page.DisplayOneQuestionOnScreen = false;
            page.KeyboardSupport = false;
            page.NavigationButtons = NavigationButtons.None;
            return page;
        }

        public Page PreviewLookAndFeel(LookAndFeelBindingModel lookAndFeelBindingModel, string language)
        {
            var survey = _surveyRepository.GetById(lookAndFeelBindingModel.SurveyId);
            if (survey != null)
            {
                var topFolder = _nodeRepository.GetNode(survey.TopFolderId);
                survey.TopFolder = topFolder as Folder;
            }
            var layout = _layoutRepository.GetById(lookAndFeelBindingModel.LayoutId);
            var theme = _themeRepository.GetById(lookAndFeelBindingModel.ThemeId);
            theme.BackgroundImage = lookAndFeelBindingModel.BackgroundImage;
            theme.Logo = lookAndFeelBindingModel.Logo;

            _requestContextProvider.Set(_requestContextFactory.Create(new SurveyAndLayout
            {
                Survey = survey,
                Layout = layout,
                Theme = theme
            }, new Respondent { Language = language }, Direction.FirstPage));

            var surveyCreator = _surveyDesignFactory(surveyId: lookAndFeelBindingModel.SurveyId, useDatabaseIds: true);
            var samplePage = surveyCreator.Page(
                surveyCreator.OpenEndedShortTextQuestion("OpenEndedShortTextQuestion", "What's your name?", "Demo Short Text question"),
                surveyCreator.SingleSelectionQuestion("SingleSelectionQuestion", "What's your favorite car?", "Demo Single Selection question", q => q.OrderType = OrderType.InOrder,
                    surveyCreator.Option("bmw", text: "BMW"),
                    surveyCreator.Option("ford", text: "Ford"),
                    surveyCreator.Option("mercedes", text: "Mercedes"),
                    surveyCreator.Option("lexus", text: "Lexus"))
                );

            var questions = samplePage.QuestionDefinitions.Select(_mapper.Map<Question>).ToList();

            var page = _pageFactory.CreateOutgoingPage(samplePage, Direction.FirstPage, questions, NavigationButtons.None);
            page.DisplayProgressBar = true;
            page.DisplayOneQuestionOnScreen = true;
            page.KeyboardSupport = false;
            page.Progress = 50;
            return page;
        }

    }
}