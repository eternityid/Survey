using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.EntityFramework.DemoData
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
            const string surveyId = "14";
            if (_surveyRepository.Exists(surveyId)) return;
            //To Do

            _insertSurveyService.InsertSurvey(_textListSurveyDefinitionDemo.CreateSurvey());
        }
    }
}
