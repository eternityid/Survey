using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.MongoDb.DemoData
{
    public class SimpleSurveyDefinitionDemo
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly Domain.SampleData.SimpleSurveyDefinitionSample _simpleSurveyDefinitionDemo;
        private readonly InsertSurveyService _insertSurveyService;

        public SimpleSurveyDefinitionDemo(ISurveyRepository surveyRepository, 
            Domain.SampleData.SimpleSurveyDefinitionSample simpleSurveyDefinitionDemo,
            InsertSurveyService insertSurveyService)
        {
            _surveyRepository = surveyRepository;
            _simpleSurveyDefinitionDemo = simpleSurveyDefinitionDemo;
            _insertSurveyService = insertSurveyService;
        }

        public void InsertData()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("1");
            if (_surveyRepository.Exists(surveyId)) return;

            var survey = _simpleSurveyDefinitionDemo.CreateSurvey();

            _insertSurveyService.InsertSurvey(survey);
        }
    }
}