using Autofac;
using Autofac.Features.ResolveAnything;
using AutoMapper;
using LearningPlatform.Data.EntityFramework;
using LearningPlatform.Data.EntityFramework.ResponsesDb;
using LearningPlatform.Data.EntityFramework.SurveysDb;
using LearningPlatform.Data.MongoDb;
using LearningPlatform.Domain;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Mappings;
using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyExecution.Request;

namespace LearningPlatform.Data.MongoDbMigration
{
    class Initializer
    {
        public static IContainer InitWithEntityFramework()
        {
            var builder = new ContainerBuilder();
            builder.RegisterModule<EntityFrameworkDataModule>();
            builder.RegisterModule<LegacyEntityFrameworkDataModule>();
            builder.RegisterType<DummyRequestObjectProvider<SurveysContext>>()
                .As<IRequestObjectProvider<SurveysContext>>()
                .InstancePerLifetimeScope();
            builder.RegisterType<DummyRequestObjectProvider<ResponsesContext>>()
                .As<IRequestObjectProvider<ResponsesContext>>()
                .InstancePerLifetimeScope();
            builder.RegisterType<DummyRequestObjectProvider<TestResponsesContext>>()
               .As<IRequestObjectProvider<TestResponsesContext>>()
               .InstancePerLifetimeScope();

            RegisterCommon(builder);
            return builder.Build();
        }

        public static IContainer InitWithMongoDb()
        {
            var builder = new ContainerBuilder();
            builder.RegisterModule<MongoDbDataModule>();
            builder.RegisterType<DummyRequestObjectProvider<MongoDbContext>>()
                .As<IRequestObjectProvider<MongoDbContext>>()
                .InstancePerLifetimeScope();
            RegisterCommon(builder);
            return builder.Build();
        }


        private static void RegisterCommon(ContainerBuilder builder)
        {
            builder.RegisterSource(new AnyConcreteTypeNotAlreadyRegisteredSource());
            builder.RegisterModule<DomainModule>();
            builder.RegisterType<DummyRequestObjectProvider<IRequestContext>>()
                .As<IRequestObjectProvider<IRequestContext>>()
                .InstancePerLifetimeScope();
            builder.RegisterType<NodeServiceMemoryCache>().As<INodeServiceCache>().InstancePerLifetimeScope();

            Mapper.Initialize(cfg => { cfg.AddProfile<DomainAutoMapperProfile>(); });
        }
    }
}