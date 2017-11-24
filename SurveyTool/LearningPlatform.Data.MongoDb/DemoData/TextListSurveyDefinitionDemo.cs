using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.MongoDb.DemoData
{
    public class TextListSurveyDefinitionDemo
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly InsertSurveyService _insertSurveyService;
        private readonly Domain.SampleData.TextListSurveyDefinitionSample _textListSurveyDefinitionDemo;

        public TextListSurveyDefinitionDemo(ISurveyRepository surveyRepository,
            InsertSurveyService insertSurveyService,
            Domain.SampleData.TextListSurveyDefinitionSample textListSurveyDefinitionDemo)
        {
            _surveyRepository = surveyRepository;
            _insertSurveyService = insertSurveyService;
            _textListSurveyDefinitionDemo = textListSurveyDefinitionDemo;
        }

        public void InsertData()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("14");
            if (_surveyRepository.Exists(surveyId)) return;

            var survey = _textListSurveyDefinitionDemo.CreateSurvey();

            _insertSurveyService.InsertSurvey(survey);
        }
    }
}
