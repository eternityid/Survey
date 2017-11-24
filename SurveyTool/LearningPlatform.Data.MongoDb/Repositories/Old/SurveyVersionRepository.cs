using System.Collections.Generic;
using LearningPlatform.Domain.SurveyPublishing;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    internal class SurveyVersionRepository : ISurveyVersionRepository
    {
        public void Add(SurveyVersion surveyVersion)
        {
            throw new System.NotImplementedException();
        }

        public SurveyVersion GetLatest(string surveyId)
        {
            throw new System.NotImplementedException();
        }

        public List<SurveyVersion> GetAll(string surveyId)
        {
            throw new System.NotImplementedException();
        }
    }
}