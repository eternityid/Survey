using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyLayout;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    public class LayoutRepository : RepositoryBase, ILayoutRepository
    {

        public LayoutRepository(IRequestObjectProvider<MongoDbContext> mongoDbContextProvider) : base(mongoDbContextProvider)
        {
        }

        private IMongoCollection<Layout> LayoutCollection => DbContext.LayoutCollection;

        public void Add(Layout layout)
        {
            LayoutCollection.InsertOne(layout);
        }

        public void AddMany(IEnumerable<Layout> layouts)
        {
            if (layouts != null && layouts.Any())
            {
                LayoutCollection.InsertMany(layouts);
            }
        }

        public Layout GetById(string id)
        {
            return LayoutCollection.FindSync(p => p.Id == id).FirstOrDefault();
        }

        public List<Layout> GetAll()
        {
            return LayoutCollection.FindSync(p => true).ToList();
        }

        public Layout GetDefaultLayout()
        {
            const string defaultLayoutName = "Default Layout";
            return GetByName(defaultLayoutName);
        }

        public IList<Layout> GetByIds(HashSet<string> layoutIds)
        {
            return LayoutCollection.FindSync(p => layoutIds.Contains(p.Id)).ToList();
        }

        public Layout GetByName(string name)
        {
            return LayoutCollection.FindSync(p => p.Name == name).FirstOrDefault();
        }
    }
}