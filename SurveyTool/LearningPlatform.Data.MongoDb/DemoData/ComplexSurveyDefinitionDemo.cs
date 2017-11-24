using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.MongoDb.DemoData
{
    public class ComplexSurveyDefinitionDemo
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly InsertSurveyService _insertSurveyService;
        private readonly Domain.SampleData.ComplexSurveyDefinitionSample _complexSurveyDefinitionDemo;


        public ComplexSurveyDefinitionDemo(ISurveyRepository surveyRepository, 
            InsertSurveyService insertSurveyService,
            Domain.SampleData.ComplexSurveyDefinitionSample complexSurveyDefinitionDemo)
        {
            _surveyRepository = surveyRepository;
            _insertSurveyService = insertSurveyService;
            _complexSurveyDefinitionDemo = complexSurveyDefinitionDemo;
        }

        public void InsertData()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("2");
            if (_surveyRepository.Exists(surveyId)) return;

            var survey = _complexSurveyDefinitionDemo.CreateSurvey();

            _insertSurveyService.InsertSurvey(survey);
        }
    }
}