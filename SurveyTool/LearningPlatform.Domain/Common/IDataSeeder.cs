using Autofac;

namespace LearningPlatform.Domain.Common
{
    public interface IDataSeeder
    {
        void Seed(IContainer container);
    }
}
