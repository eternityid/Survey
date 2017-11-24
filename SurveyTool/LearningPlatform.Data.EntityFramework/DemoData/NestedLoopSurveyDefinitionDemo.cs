using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.EntityFramework.DemoData
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
            const string surveyId = "9";
            if (_surveyRepository.Exists(surveyId)) return;

            _insertSurveyService.InsertSurvey(_nestedLoopSurveyDefinitionDemo.CreateSurvey());
        }
    }
}
