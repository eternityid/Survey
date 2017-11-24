using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.EntityFramework.DemoData
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
            const string surveyId = "8";
            if (_surveyRepository.Exists(surveyId)) return;
            //To Do
            _insertSurveyService.InsertSurvey(_conditionSurveyDefinitionDemo.CreateSurvey());
        }
    }
}