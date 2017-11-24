using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.ReportDesign;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;
using LearningPlatform.Domain.SurveyExecution.Engine.RandomDataGenerator;
using LearningPlatform.Domain.SurveyPublishing;

namespace LearningPlatform.Data.EntityFramework.DemoData
{
    public class E2ESurveyDefinitionDemo
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly IRequestObjectProvider<SurveysDb.SurveysContext> _surveyContextProvider;
        private readonly PublishingService _publishingService;
        private readonly RandomDataGenerator _randomDataGenerator;
        private readonly ReportDefinitionService _reportDefinitionService;
        private readonly Domain.SampleData.E2ESurveyDefinitionSample _e2ESurveyDefinitionDemo;
        private readonly InsertSurveyService _insertSurveyService;

        public E2ESurveyDefinitionDemo(ISurveyRepository surveyRepository, 
            IRequestObjectProvider<SurveysDb.SurveysContext> surveyContextProvider, 
            PublishingService publishingService, 
            RandomDataGenerator randomDataGenerator, 
            ReportDefinitionService reportDefinitionService, 
            Domain.SampleData.E2ESurveyDefinitionSample e2ESurveyDefinitionDemo,
            InsertSurveyService insertSurveyService)
        {
            _surveyRepository = surveyRepository;
            _surveyContextProvider = surveyContextProvider;
            _publishingService = publishingService;
            _randomDataGenerator = randomDataGenerator;
            _reportDefinitionService = reportDefinitionService;
            _e2ESurveyDefinitionDemo = e2ESurveyDefinitionDemo;
        }

        public void InsertData()
        {
            const string surveyId = "00000000000000000000000a";
            if (_surveyRepository.Exists(surveyId)) return;

            var survey = _e2ESurveyDefinitionDemo.CreateSurvey();
            _insertSurveyService.InsertSurvey(survey);

            _publishingService.Publish(survey.Id);
            _surveyContextProvider.Get().SaveChanges();
            _randomDataGenerator.Generate(survey.Id, 10, false);

            var reportDefinition = new ReportDefinition
            {
                UserId = survey.UserId,
                SurveyId = survey.Id,
                Name = "Report for e2e"
            };
            var newReport = _reportDefinitionService.AddReportDefinition(reportDefinition);
            _surveyContextProvider.Get().SaveChanges();
            _reportDefinitionService.AddDefaultPage(newReport);
            _surveyContextProvider.Get().SaveChanges();
        }
    }
}