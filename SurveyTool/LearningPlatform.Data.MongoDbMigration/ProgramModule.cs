using Autofac;
using Autofac.Features.ResolveAnything;
using LearningPlatform.Data.EntityFramework;
using LearningPlatform.Data.MongoDb;
using LearningPlatform.Data.MongoDbMigration.Converters;
using LearningPlatform.Domain.Common;

namespace LearningPlatform.Data.MongoDbMigration
{
    internal class ProgramModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            var entityFrameworkContainer = Initializer.InitWithEntityFramework();
            var mongoDbContainer = Initializer.InitWithMongoDb();
            var provider = mongoDbContainer.Resolve<IRequestObjectProvider<MongoDbContext>>();
            var dbContext = new MongoDbContext();
            provider.Set(dbContext);

            builder.RegisterSource(new AnyConcreteTypeNotAlreadyRegisteredSource());
            builder.RegisterType<LayoutConverter>().InstancePerLifetimeScope();
            builder.RegisterType<ThemeConverter>().InstancePerLifetimeScope();
            builder.RegisterType<SurveyConverter>().InstancePerLifetimeScope();
            builder.RegisterType<SurveyVersionConverter>().InstancePerLifetimeScope();
            builder.RegisterType<NodeConverter>().InstancePerLifetimeScope();
            builder.RegisterType<QuestionConverter>().InstancePerLifetimeScope();
            builder.RegisterType<OptionListConverter>().InstancePerLifetimeScope();
            builder.RegisterType<ExpressionConverter>().InstancePerLifetimeScope();
            builder.RegisterType<RespondentAndAnswerConverter>().InstancePerLifetimeScope();
            builder.RegisterType<ReportConverter>().InstancePerLifetimeScope();
            builder.RegisterModule<EntityFrameworkDataModule>();
            builder.RegisterInstance(new Containers
            {
                EntityFrameworkContainer = entityFrameworkContainer,
                MongoDbContainer = mongoDbContainer
            });
        }
    }
}