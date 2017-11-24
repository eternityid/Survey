using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.MongoDb.DemoData
{
    class NestedLoopSurveyDefinitionDemo
    {        
        private readonly ISurveyRepository _surveyRepository;
        private readonly InsertSurveyService _insertSurveyService;
        private readonly Domain.SampleData.NestedLoopSurveyDefinitionSample _nestedLoopSurveyDefinitionDemo;

        public NestedLoopSurveyDefinitionDemo(ISurveyRepository surveyRepository,
            InsertSurveyService insertSurveyService,
            Domain.SampleData.NestedLoopSurveyDefinitionSample nestedLoopSurveyDefinitionDemo)
        {
            _surveyRepository = surveyRepository;
            _insertSurveyService = insertSurveyService;
            _nestedLoopSurveyDefinitionDemo = nestedLoopSurveyDefinitionDemo;
        }

        public void InsertData()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("9");
            if (_surveyRepository.Exists(surveyId)) return;

            var survey = _nestedLoopSurveyDefinitionDemo.CreateSurvey();

            _insertSurveyService.InsertSurvey(survey);
        }
    }
}
