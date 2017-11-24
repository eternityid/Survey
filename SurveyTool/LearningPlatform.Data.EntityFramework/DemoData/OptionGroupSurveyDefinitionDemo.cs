using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.EntityFramework.DemoData
{
    public class OptionGroupSurveyDefinitionDemo
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly Domain.SampleData.OptionGroupSurveyDefinitionSample _optionGroupSurveyDefinitionDemo;
        private readonly InsertSurveyService _insertSurveyService;

        public OptionGroupSurveyDefinitionDemo(ISurveyRepository surveyRepository,
            InsertSurveyService insertSurveyService,
            Domain.SampleData.OptionGroupSurveyDefinitionSample optionGroupSurveyDefinitionDemo)
        {
            _surveyRepository = surveyRepository;
            _optionGroupSurveyDefinitionDemo = optionGroupSurveyDefinitionDemo;
            _insertSurveyService = insertSurveyService;
        }

        public void InsertData()
        {
            const string surveyId = "13";
            if (_surveyRepository.Exists(surveyId)) return;
            //To Do

            _insertSurveyService.InsertSurvey(_optionGroupSurveyDefinitionDemo.CreateSurvey());
        }
    }
}