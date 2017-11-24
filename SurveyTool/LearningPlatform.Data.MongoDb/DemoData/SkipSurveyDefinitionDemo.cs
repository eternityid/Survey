using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.MongoDb.DemoData
{
    public class SkipSurveyDefinitionDemo
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly Domain.SampleData.SkipSurveyDefinitionSample _skipSurveyDefinitionDemo;
        private readonly InsertSurveyService _insertSurveyService;

        public SkipSurveyDefinitionDemo(ISurveyRepository surveyRepository,
            Domain.SampleData.SkipSurveyDefinitionSample skipSurveyDefinitionDemo,
            InsertSurveyService insertSurveyService)
        {
            _surveyRepository = surveyRepository;
            _insertSurveyService = insertSurveyService;
            _skipSurveyDefinitionDemo = skipSurveyDefinitionDemo;
        }

        public void InsertData()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("7");
            if (_surveyRepository.Exists(surveyId)) return;

            var survey = _skipSurveyDefinitionDemo.CreateSurvey();

            _insertSurveyService.InsertSurvey(survey);
        }
    }
}