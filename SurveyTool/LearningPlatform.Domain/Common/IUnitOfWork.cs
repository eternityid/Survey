using System;

namespace LearningPlatform.Domain.Common
{
    public interface IUnitOfWork : IDisposable
    {
        int SavePoint();

        void Commit();
        void Rollback();
    }
}