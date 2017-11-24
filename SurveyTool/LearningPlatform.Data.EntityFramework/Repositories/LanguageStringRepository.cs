using System.Collections.Generic;
using LearningPlatform.Domain.SurveyDesign.LanguageStrings;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    class LanguageStringRepository : ILanguageStringRepository
    {
        private readonly GenericRepository<LanguageString> _genericRepository;

        public LanguageStringRepository(GenericRepository<LanguageString> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        private SurveysDb.SurveysContext Context { get { return _genericRepository.Context; } }

        public void Delete(long id)
        {
            _genericRepository.Remove(id);
        }

        public void Delete(IEnumerable<LanguageString> languages)
        {
            Context.LanguageStrings.RemoveRange(languages);
        }
    }
}
