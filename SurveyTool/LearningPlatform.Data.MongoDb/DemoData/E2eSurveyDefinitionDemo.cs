using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.ReportDesign;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;
using LearningPlatform.Domain.SurveyExecution.Engine.RandomDataGenerator;
using LearningPlatform.Domain.SurveyPublishing;

namespace LearningPlatform.Data.MongoDb.DemoData
{
    public class E2ESurveyDefinitionDemo
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly IUnitOfWorkFactory _unitOfWorkFactory;
        private readonly PublishingService _publishingService;
        private readonly RandomDataGenerator _randomDataGenerator;
        private readonly ReportDefinitionService _reportDefinitionService;
        private readonly Domain.SampleData.E2ESurveyDefinitionSample _e2ESurveyDefinitionDemo;
        private readonly InsertSurveyService _insertSurveyService;

        public E2ESurveyDefinitionDemo(ISurveyRepository surveyRepository,
            IUnitOfWorkFactory unitOfWorkFactory,
            PublishingService publishingService,
            RandomDataGenerator randomDataGenerator,
            ReportDefinitionService reportDefinitionService,
            Domain.SampleData.E2ESurveyDefinitionSample e2ESurveyDefinitionDemo,
            InsertSurveyService insertSurveyService)
        {
            _surveyRepository = surveyRepository;
            _unitOfWorkFactory = unitOfWorkFactory;
            _publishingService = publishingService;
            _randomDataGenerator = randomDataGenerator;
            _reportDefinitionService = reportDefinitionService;
            _e2ESurveyDefinitionDemo = e2ESurveyDefinitionDemo;
            _insertSurveyService = insertSurveyService;
        }

        public void InsertData()
        {
            var surveyId = ObjectIdHelper.GetObjectIdFromLongString("10");
            if (_surveyRepository.Exists(surveyId)) return;

            var survey = _e2ESurveyDefinitionDemo.CreateSurvey();

            _insertSurveyService.InsertSurvey(survey);

            using (var unitOfWork = _unitOfWorkFactory.Create())
            {
                _publishingService.Publish(survey.Id);
                unitOfWork.SavePoint();

                _randomDataGenerator.Generate(survey.Id, 10, false);
                unitOfWork.SavePoint();

                var report = _reportDefinitionService.AddReportDefinition(new ReportDefinition
                {
                    UserId = survey.UserId,
                    SurveyId = survey.Id,
                    Name = "Report for e2e"
                });
                unitOfWork.SavePoint();

                _reportDefinitionService.AddDefaultPage(report);
                unitOfWork.SavePoint();

                unitOfWork.Commit();
            }
        }
    }
}