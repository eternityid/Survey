using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.EntityFramework.DemoData
{
    public class RegexValidationSurveyDefinitionDemo
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly InsertSurveyService _insertSurveyService;
        private readonly Domain.SampleData.RegexValidationSurveyDefinitionSample _regexValidationSurveyDefinitionDemo;
        public RegexValidationSurveyDefinitionDemo(ISurveyRepository surveyRepository,
            InsertSurveyService insertSurveyService,
            Domain.SampleData.RegexValidationSurveyDefinitionSample regexValidationSurveyDefinitionDemo)
        {
            _surveyRepository = surveyRepository;
            _insertSurveyService = insertSurveyService;
            _regexValidationSurveyDefinitionDemo = regexValidationSurveyDefinitionDemo;
        }

        public void InsertData()
        {
            const string surveyId = "12";
            if (_surveyRepository.Exists(surveyId)) return;

            _insertSurveyService.InsertSurvey(_regexValidationSurveyDefinitionDemo.CreateSurvey());
        }
    }
}