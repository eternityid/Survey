using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LearningPlatform.Domain.Common;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    public class RepositoryBase
    {
        private readonly IRequestObjectProvider<MongoDbContext> _mongoDbContextProvider;

        public RepositoryBase(IRequestObjectProvider<MongoDbContext> mongoDbContextProvider)
        {
            _mongoDbContextProvider = mongoDbContextProvider;
        }

        protected MongoDbContext DbContext
        {
            get
            {
                var context =  _mongoDbContextProvider.Get();
                if (context == null)
                {
                    lock (typeof(RepositoryBase))
                    {
                        context = _mongoDbContextProvider.Get();
                        if (context == null)
                        {
                            context = new MongoDbContext();
                            _mongoDbContextProvider.Set(context);
                        }
                    }
                }
                return context;
            }
        }
    }
}
