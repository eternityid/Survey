using Autofac;
using Autofac.Features.ResolveAnything;
using LearningPlatform.Application;
using LearningPlatform.Data;
using LearningPlatform.Data.Elasticsearch;
using LearningPlatform.Data.EntityFramework;
using LearningPlatform.Data.MongoDb;
using LearningPlatform.Domain;
using LearningPlatform.SurveyExecution.Data;

namespace LearningPlatform
{
    public static class AutofacConfig
    {
        public static ContainerBuilder Configure()
        {
            var builder = new ContainerBuilder();
            builder.RegisterSource(new AnyConcreteTypeNotAlreadyRegisteredSource());
            builder.RegisterModule<ApplicationModule>();
            builder.RegisterModule<DomainModule>();
            builder.RegisterModule<MongoDbDataModule>();
            builder.RegisterModule<EntityFrameworkDataModule>();
            builder.RegisterModule<ElasticsearchDataModule>();
            builder.RegisterModule<SurveyExecutionDataModule>();
            return builder;
        }
    }
}