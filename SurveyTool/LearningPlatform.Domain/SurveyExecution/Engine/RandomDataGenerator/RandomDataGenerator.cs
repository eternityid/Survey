using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyPublishing;
using System.Collections.Specialized;
using System.Linq;

namespace LearningPlatform.Domain.SurveyExecution.Engine.RandomDataGenerator
{
    public class RandomDataGenerator
    {
        private readonly SurveyExecutor _surveyExecutor;
        private readonly PageService _pageService;
        private readonly IRequestObjectProvider<IRequestContext> _requestContextProvider;
        private readonly AnswerGeneratorService _answerGeneratorService;
        private readonly PublishingService _publishingService;
        private readonly RequestInitializer _requestInitializer;


        public RandomDataGenerator(SurveyExecutor surveyExecutor, PageService pageService,
            IRequestObjectProvider<IRequestContext> requestContextProvider, AnswerGeneratorService answerGeneratorService, PublishingService publishingService,
            RequestInitializer requestInitializer)
        {
            _surveyExecutor = surveyExecutor;
            _pageService = pageService;
            _requestContextProvider = requestContextProvider;
            _answerGeneratorService = answerGeneratorService;
            _publishingService = publishingService;
            _requestInitializer = requestInitializer;
        }

        public void Generate(string surveyId, int iterations)
        {
            const bool isTesting = true;
            Generate(surveyId, iterations, isTesting);
        }

        public void Generate(string surveyId, int iterations, bool isTesting)
        {
            var surveyAndLayout = _publishingService.GetSurveyAndLayout(surveyId, isTesting);
            var errorPage = _surveyExecutor.ValidateSurvey(surveyAndLayout);
            if (errorPage != null) return;

            for (int i = 0; i < iterations; i++)
            {
                GenerateResponse(surveyAndLayout);
            }
        }

        private void GenerateResponse(SurveyAndLayout surveyAndLayout)
        {
            _requestInitializer.Initialize(surveyAndLayout, Direction.FirstPage);

            Page page = _surveyExecutor.BeginOpenSurvey(surveyAndLayout);
            while (!StopGeneration(page))
            {
                NameValueCollection nameValueCollection = Answer(page);
                page = _surveyExecutor.Navigate(surveyAndLayout, Direction.Forward, nameValueCollection);
            }
        }

        private static bool StopGeneration(Page page)
        {
            return page == null || page.Errors.Any() || page.NavigationButtons == NavigationButtons.Previous ||
                   page.NavigationButtons == NavigationButtons.None;
        }

        private NameValueCollection Answer(Page page)
        {
            foreach (Question question in page.Questions)
            {
                GenerateAnswer(question);
            }
            return _pageService.GetNameValueCollection(page);
        }

        private void GenerateAnswer(Question question)
        {
            var definition = _requestContextProvider.Get().NodeService.GetQuestionDefinitionByAlias(question.Alias);
            _answerGeneratorService.GenerateAnswer(question, definition);

        }
    }
}