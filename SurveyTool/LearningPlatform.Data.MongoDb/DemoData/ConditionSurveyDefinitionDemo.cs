using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.MongoDb.DemoData
{
    public class ConditionSurveyDefinitionDemo
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly Domain.SampleData.ConditionSurveyDefinitionSample _conditionSurveyDefinitionDemo;
        private readonly InsertSurveyService _insertSurveyService;

        public ConditionSurveyDefinitionDemo(ISurveyRepository surveyRepository,
            Domain.SampleData.ConditionSurveyDefinitionSample conditionSurveyDefinitionDemo,
            InsertSurveyService insertSurveyService)
        {
            _surveyRepository = surveyRepository;
            _conditionSurveyDefinitionDemo = conditionSurveyDefinitionDemo;
            _insertSurveyService = insertSurveyService;
        }

        public void InsertData()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("8");
            if (_surveyRepository.Exists(surveyId)) return;

            var survey = _conditionSurveyDefinitionDemo.CreateSurvey();

            _insertSurveyService.InsertSurvey(survey);
        }
    }
}