using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.EntityFramework.DemoData
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
            const string surveyId = "1";
            if (_surveyRepository.Exists(surveyId)) return;

            _insertSurveyService.InsertSurvey(_simpleSurveyDefinitionDemo.CreateSurvey());
        }
    }
}