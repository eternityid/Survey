using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;

namespace LearningPlatform.Domain.SurveyDesign.Services.Survey
{
    public class ReadSurveyMemoryService : IReadSurveyService
    {
        private readonly ISurveyRepository _surveyRepository;

        public ReadSurveyMemoryService(ISurveyRepository surveyRepository)
        {
            _surveyRepository = surveyRepository;
        }


        public Domain.SurveyDesign.Survey GetFullSurvey(string surveyId)
        {
            return _surveyRepository.GetById(surveyId);
        }

        public Domain.SurveyDesign.Survey GetFullLibrarySurvey(string libraryId, string surveyId)
        {
            return null;
        }

        public void PopulateSurveyContent(Domain.SurveyDesign.Survey survey)
        {

        }
    }
}
