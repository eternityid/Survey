using LearningPlatform.Domain.Common;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    public class UnitOfWorkFactory : IUnitOfWorkFactory
    {

        public IUnitOfWork Create()
        {
            return new UnitOfWork().Begin();
        }
    }
}