using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.Resources;

namespace LearningPlatform.Data.Memory.Repositories
{
    public class ResourceStringMemoryRepository : IResourceStringRepository
    {
        private readonly SurveyMemoryContext _context;
        private readonly List<ResourceString> _resourceStrings = new List<ResourceString>();

        public ResourceStringMemoryRepository(SurveyMemoryContext context)
        {
            _context = context;
        }

        public void Add(ResourceString resourceString)
        {
            _resourceStrings.Add(resourceString);
            _context.Add(resourceString);
        }

        public IList<ResourceString> GetByNameForSurvey(string name, string surveyId)
        {
            return _resourceStrings.Where(p=>p.Name==name && (p.SurveyId==surveyId || p.SurveyId==null)).ToList();
        }
    }
}