using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;
using LearningPlatform.Domain.SurveyPublishing;

namespace LearningPlatform.Data.EntityFramework.DemoData
{
    public class UiTestKeyboardSurveyDefinitionDemo
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly PublishingService _publishingService;
        private readonly Domain.SampleData.UiTestKeyboardSurveyDefinitionSample _uiTestKeyboardSurveyDefinitionDemo;
        private readonly InsertSurveyService _insertSurveyService;

        public UiTestKeyboardSurveyDefinitionDemo(ISurveyRepository surveyRepository, 
            PublishingService publishingService,
            Domain.SampleData.UiTestKeyboardSurveyDefinitionSample uiTestKeyboardSurveyDefinitionDemo,
            InsertSurveyService insertSurveyService)
        {
            _surveyRepository = surveyRepository;
            _publishingService = publishingService;
            _uiTestKeyboardSurveyDefinitionDemo = uiTestKeyboardSurveyDefinitionDemo;
            _insertSurveyService = insertSurveyService;
        }

        public void InsertData()
        {
            const string surveyId = "6";
            if (_surveyRepository.Exists(surveyId)) return;

            var survey = _uiTestKeyboardSurveyDefinitionDemo.CreateSurvey();
            _insertSurveyService.InsertSurvey(survey);
            _publishingService.Publish(survey.Id);
        }
    }
}