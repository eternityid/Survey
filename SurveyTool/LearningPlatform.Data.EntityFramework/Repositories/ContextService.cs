using System.Data.Entity;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    public class ContextService
    {
        private readonly SurveysContextProvider _surveysContextProvider;
        private readonly ResponsesContextProvider _responsesContextProvider;

        public ContextService(SurveysContextProvider surveysContextProvider, ResponsesContextProvider responsesContextProvider)
        {
            _surveysContextProvider = surveysContextProvider;
            _responsesContextProvider = responsesContextProvider;
        }

        public bool HasChanges
        {
            get
            {
                return _surveysContextProvider.Get().ChangeTracker.HasChanges() ||
                       _responsesContextProvider.Get(true).ChangeTracker.HasChanges() ||
                       _responsesContextProvider.Get(false).ChangeTracker.HasChanges();
            }
        }

        public int SaveChanges()
        {
            int count = _surveysContextProvider.Get().SaveChanges();
            count += _responsesContextProvider.Get(false).SaveChanges();
            count += _responsesContextProvider.Get(true).SaveChanges();
            return count;
        }

        public DbContextTransaction BeginTransaction()
        {
            return _surveysContextProvider.Get().Database.BeginTransaction();
        }
    }
}