using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.EntityFramework.DemoData
{
    public class CustomNavigationTextSurveyDefinitionDemo
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly Domain.SampleData.CustomNavigationTextSurveyDefinitionSample _customNavigationTextSurveyDefinitionDemo;
        private readonly InsertSurveyService _insertSurveyService;

        public CustomNavigationTextSurveyDefinitionDemo(ISurveyRepository surveyRepository,
            InsertSurveyService insertSurveyService,
            Domain.SampleData.CustomNavigationTextSurveyDefinitionSample customNavigationTextSurveyDefinitionDemo)
        {
            _surveyRepository = surveyRepository;
            _customNavigationTextSurveyDefinitionDemo = customNavigationTextSurveyDefinitionDemo;
            _insertSurveyService = insertSurveyService;
        }

        public void InsertData()
        {
            const string surveyId = "15";
            if (_surveyRepository.Exists(surveyId)) return;
            //To Do

            _insertSurveyService.InsertSurvey(_customNavigationTextSurveyDefinitionDemo.CreateSurvey());
        }
    }
}
