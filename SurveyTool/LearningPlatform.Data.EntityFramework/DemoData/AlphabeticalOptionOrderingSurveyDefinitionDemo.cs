using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.EntityFramework.DemoData
{
    public class AlphabeticalOptionOrderingSurveyDefinitionDemo
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly InsertSurveyService _insertSurveyService;
        private readonly Domain.SampleData.AlphabeticalOptionOrderingSurveyDefinitionSample _alphabeticalOptionOrderingSurveyDefinitionDemo;

        public AlphabeticalOptionOrderingSurveyDefinitionDemo(ISurveyRepository surveyRepository, 
            InsertSurveyService insertSurveyService,
            Domain.SampleData.AlphabeticalOptionOrderingSurveyDefinitionSample alphabeticalOptionOrderingSurveyDefinitionDemo)
        {
            _surveyRepository = surveyRepository;
            _insertSurveyService = insertSurveyService;
            _alphabeticalOptionOrderingSurveyDefinitionDemo = alphabeticalOptionOrderingSurveyDefinitionDemo;
        }

        public void InsertData()
        {
            const string surveyId = "11";
            if (_surveyRepository.Exists(surveyId)) return;

            _insertSurveyService.InsertSurvey(_alphabeticalOptionOrderingSurveyDefinitionDemo.CreateSurvey());
        }
    }
}