using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyLayout
{
    public interface ILayoutRepository
    {
        void Add(Layout layout);
        void AddMany(IEnumerable<Layout> layouts);
        Layout GetById(string id);
        List<Layout> GetAll();
        Layout GetDefaultLayout();
        IList<Layout> GetByIds(HashSet<string> layoutIds);
        Layout GetByName(string name);
    }
}