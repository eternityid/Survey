namespace LearningPlatform.Domain.Common
{
    public interface IUnitOfWorkFactory
    {
        IUnitOfWork Create();
    }
}