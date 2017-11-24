using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using Autofac;
using LearningPlatform.Domain.Resources;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    class ResourceStringRepository : IResourceStringRepository
    {
        private readonly GenericRepository<ResourceString> _genericRepository;
        private readonly IComponentContext _componentContext;

        public ResourceStringRepository(GenericRepository<ResourceString> genericRepository, IComponentContext componentContext)
        {
            _genericRepository = genericRepository;
            _componentContext = componentContext;
        }

        public IList<ResourceString> GetByNameForSurvey(string name, string surveyId)
        {
            return _genericRepository.GetAll(p => p.Name == name && (p.SurveyId==surveyId || p.SurveyId ==null), includePath => includePath.Items).ToList();
        }
    }
}
