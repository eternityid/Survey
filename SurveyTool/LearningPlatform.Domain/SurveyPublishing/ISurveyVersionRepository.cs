using System.Collections.Generic;
namespace LearningPlatform.Domain.SurveyPublishing
{
    public interface ISurveyVersionRepository
    {
        void Add(SurveyVersion surveyVersion);
        SurveyVersion GetLatest(string surveyId);
        List<SurveyVersion> GetAll(string surveyId);
    }
}