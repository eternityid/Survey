using System.Collections.Generic;
using LearningPlatform.Domain.SurveyPublishing;

namespace LearningPlatform.Data.Memory.Repositories
{
    public class SurveyVersionMemoryRepository : ISurveyVersionRepository
    {
        private readonly SurveyMemoryContext _context;
        private readonly Dictionary<string, SurveyVersion> _versions = new Dictionary<string, SurveyVersion>();

        public SurveyVersionMemoryRepository(SurveyMemoryContext context)
        {
            _context = context;
        }

        public void Add(SurveyVersion surveyVersion)
        {
            _versions[surveyVersion.SurveyId] = surveyVersion;
            _context.Add(surveyVersion);
        }

        public SurveyVersion GetLatest(string surveyId)
        {
            return _versions[surveyId];
        }

        public List<SurveyVersion> GetAll(string surveyId)
        {
            return null;
        }
    }
}