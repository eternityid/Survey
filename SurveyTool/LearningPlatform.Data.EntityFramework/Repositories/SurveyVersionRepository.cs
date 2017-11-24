using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.SurveyPublishing;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    internal class SurveyVersionRepository : ISurveyVersionRepository
    {
        private readonly GenericRepository<SurveyVersion> _genericRepository;

        public SurveyVersionRepository(GenericRepository<SurveyVersion> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        private SurveysDb.SurveysContext Context { get { return _genericRepository.Context; } }

        public void Add(SurveyVersion surveyVersion)
        {
            _genericRepository.Add(surveyVersion);
        }

        public SurveyVersion GetLatest(string surveyId)
        {
            return Context.SurveyVersions.Where(v => v.SurveyId == surveyId).OrderByDescending(p => p.Id).FirstOrDefault();
        }

        public List<SurveyVersion> GetAll(string surveyId)
        {
            return Context.SurveyVersions.Where(v => v.SurveyId == surveyId).ToList();
        }
    }
}