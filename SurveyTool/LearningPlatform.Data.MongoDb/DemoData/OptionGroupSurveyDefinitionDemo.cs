using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.MongoDb.DemoData
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
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("13");
            if (_surveyRepository.Exists(surveyId)) return;

            var survey = _optionGroupSurveyDefinitionDemo.CreateSurvey();

            _insertSurveyService.InsertSurvey(survey);
        }
    }
}