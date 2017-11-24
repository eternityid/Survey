using Autofac;

namespace LearningPlatform.Data.MongoDbMigration
{
    public class Containers
    {
        public IContainer EntityFrameworkContainer { get; set; }
        public IContainer MongoDbContainer { get; set; }
    }
}