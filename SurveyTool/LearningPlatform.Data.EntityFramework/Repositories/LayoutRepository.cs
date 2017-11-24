using LearningPlatform.Domain.SurveyLayout;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    internal class LayoutRepository : ILayoutRepository
    {
        private readonly GenericRepository<Layout> _genericRepository;

        public LayoutRepository(GenericRepository<Layout> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        public void Add(Layout layout)
        {
            _genericRepository.Add(layout);
        }

        public void AddMany(IEnumerable<Layout> layouts)
        {
            _genericRepository.AddMany(layouts);
        }

        public Layout GetById(string id)
        {
            return _genericRepository.Context.Layouts
                .Include(p => p.Templates)
                .FirstOrDefault(p => p.Id == id);
        }

        public List<Layout> GetAll()
        {
            return _genericRepository.Context.Layouts.OrderBy(s => s.Name).ToList();
        }

        public Layout GetDefaultLayout()
        {
            const string defaultLayoutName = "Default Layout";
            return
                _genericRepository.Context.Layouts
                    .Include(p => p.Templates)
                    .FirstOrDefault(p => p.Name.Equals(defaultLayoutName));
        }

        public IList<Layout> GetByIds(HashSet<string> layoutIds)
        {
            return _genericRepository.Context.Layouts
                .Include(p => p.Templates)
                .Where(p => layoutIds.Contains(p.Id)).ToList();
        }

        public Layout GetByName(string name)
        {
            throw new NotImplementedException();
        }
    }
}