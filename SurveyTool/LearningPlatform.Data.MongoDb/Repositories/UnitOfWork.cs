using LearningPlatform.Domain.Common;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        public int SavePoint()
        {
            return 0;
        }

        public IUnitOfWork Begin()
        {
            return this;
        }

        public void Commit()
        {
        }

        public void Rollback()
        {
        }


        public void Dispose()
        {
            Rollback();
        }
    }
}