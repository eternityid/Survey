using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.EntityFramework.DemoData
{
    public class CarryOverOptionsSurveyDefinitionDemo
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly InsertSurveyService _insertSurveyService;
        private readonly Domain.SampleData.CarryOverOptionsSurveyDefinitionSample _carryOverOptionsSurveyDefinitionDemo;

        public CarryOverOptionsSurveyDefinitionDemo(ISurveyRepository surveyRepository,
            InsertSurveyService insertSurveyService,
            Domain.SampleData.CarryOverOptionsSurveyDefinitionSample carryOverOptionsSurveyDefinitionDemo)
        {
            _surveyRepository = surveyRepository;
            _insertSurveyService = insertSurveyService;
            _carryOverOptionsSurveyDefinitionDemo = carryOverOptionsSurveyDefinitionDemo;
        }

        public void InsertData()
        {
            const string surveyId = "2";
            if (_surveyRepository.Exists(surveyId)) return;

            _insertSurveyService.InsertSurvey(_carryOverOptionsSurveyDefinitionDemo.CreateSurvey());
        }
    }
}