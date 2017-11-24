using LearningPlatform.Domain.SurveyLayout;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Data.Memory.Repositories
{
    public class LayoutMemoryRepository : ILayoutRepository
    {
        public void Add(Layout layout)
        {
        }

        public void AddMany(IEnumerable<Layout> layouts)
        {
            throw new NotImplementedException();
        }

        public Layout GetById(string id)
        {
            //TODO: Implement real memory reprository for this
            var layout = MemoryLayout.Create();
            layout.Id = id;
            return layout;
        }

        public List<Layout> GetAll()
        {
            return new List<Layout>();
        }

        public Layout GetDefaultLayout()
        {
            return GetById("000000000000000000000001");
        }

        public IList<Layout> GetByIds(HashSet<string> layoutIds)
        {
            return new List<Layout>();
        }

        public Layout GetByName(string name)
        {
            throw new NotImplementedException();
        }
    }
}
