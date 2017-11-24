using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.MongoDb.DemoData
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
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("15");
            if (_surveyRepository.Exists(surveyId)) return;

            var survey = _customNavigationTextSurveyDefinitionDemo.CreateSurvey();

            _insertSurveyService.InsertSurvey(survey);
        }
    }
}
