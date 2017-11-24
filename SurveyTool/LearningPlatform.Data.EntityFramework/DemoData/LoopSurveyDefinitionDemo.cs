using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.EntityFramework.DemoData
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
            const string surveyId = "2";
            if (_surveyRepository.Exists(surveyId)) return;

            _insertSurveyService.InsertSurvey(_loopSurveyDefinitionDemo.CreateSurvey());
        }
    }
}
