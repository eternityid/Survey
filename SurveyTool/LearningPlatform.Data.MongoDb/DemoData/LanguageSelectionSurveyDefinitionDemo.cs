using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.MongoDb.DemoData
{
    public class LanguageSelectionSurveyDefinitionDemo
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly InsertSurveyService _insertSurveyService;
        private readonly Domain.SampleData.LanguageSelectionSurveyDefinitionSample _languageSelectionSurveyDefinitionDemo;

        public LanguageSelectionSurveyDefinitionDemo(ISurveyRepository surveyRepository, 
            InsertSurveyService insertSurveyService,
            Domain.SampleData.LanguageSelectionSurveyDefinitionSample languageSelectionSurveyDefinitionDemo)
        {
            _surveyRepository = surveyRepository;
            _insertSurveyService = insertSurveyService;
            _languageSelectionSurveyDefinitionDemo = languageSelectionSurveyDefinitionDemo;
        }

        public void InsertData()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("16");
            if (_surveyRepository.Exists(surveyId)) return;
            //To Do
            var survey = _languageSelectionSurveyDefinitionDemo.CreateSurvey();

            _insertSurveyService.InsertSurvey(survey);
        }
    }
}