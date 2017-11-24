using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.MongoDb.DemoData
{
    class LoopSurveyDefinitionDemo
    {        
        private readonly ISurveyRepository _surveyRepository;
        private readonly InsertSurveyService _insertSurveyService;
        private readonly Domain.SampleData.LoopSurveyDefinitionSample _loopSurveyDefinitionDemo;

        public LoopSurveyDefinitionDemo(ISurveyRepository surveyRepository, 
            Domain.SampleData.LoopSurveyDefinitionSample loopSurveyDefinitionDemo,
            InsertSurveyService insertSurveyService)
        {
            _surveyRepository = surveyRepository;
            _loopSurveyDefinitionDemo = loopSurveyDefinitionDemo;
            _insertSurveyService = insertSurveyService;
        }

        public void InsertData()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("3");
            if (_surveyRepository.Exists(surveyId)) return;

            var survey = _loopSurveyDefinitionDemo.CreateSurvey();

            _insertSurveyService.InsertSurvey(survey);
        }
    }
}
