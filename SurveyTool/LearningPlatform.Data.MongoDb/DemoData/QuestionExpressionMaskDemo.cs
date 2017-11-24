using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;

namespace LearningPlatform.Data.MongoDb.DemoData
{
    public class QuestionExpressionMaskDemo
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly InsertSurveyService _insertSurveyService;
        private readonly Domain.SampleData.QuestionExpressionMaskSample _questionExpressionMaskSample;

        public QuestionExpressionMaskDemo(ISurveyRepository surveyRepository,
            InsertSurveyService insertSurveyService,
            Domain.SampleData.QuestionExpressionMaskSample questionExpressionMaskSample)
        {
            _surveyRepository = surveyRepository;
            _insertSurveyService = insertSurveyService;
            _questionExpressionMaskSample = questionExpressionMaskSample;
        }

        public void InsertData()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("5");
            if (_surveyRepository.Exists(surveyId)) return;

            var survey = _questionExpressionMaskSample.CreateSurvey();

            _insertSurveyService.InsertSurvey(survey);
        }
    }
}