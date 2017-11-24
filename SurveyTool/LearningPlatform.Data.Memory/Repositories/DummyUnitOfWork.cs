using LearningPlatform.Domain.Common;

namespace LearningPlatform.Data.Memory.Repositories
{
    public class DummyUnitOfWork : IUnitOfWork
    {
        private readonly SurveyMemoryContext _context;

        public DummyUnitOfWork(SurveyMemoryContext context)
        {
            _context = context;
        }

        public IUnitOfWork Begin()
        {
            return this;
        }

        public int SavePoint()
        {
            _context.AssignIds();
            return 0;
        }


        public void Commit()
        {
        }

        public void Rollback()
        {
        }

        public void Dispose()
        {
        }
    }
}
