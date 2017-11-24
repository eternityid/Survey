using Autofac;
using LearningPlatform.Data.Memory.Repositories;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyLayout;
using LearningPlatform.Domain.SurveyPublishing;
using LearningPlatform.SurveyExecution.Data;

namespace LearningPlatform.Data.Memory
{
    /// <summary>
    /// This access module is needed by Random Data Generator
    /// </summary>
    public class DataMemoryAccessModule : Module, IDataMemoryAccessModule
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<ThemeMemoryRepository>().As<IThemeRepository>().InstancePerLifetimeScope();
            builder.RegisterType<LayoutMemoryRepository>().As<ILayoutRepository>().InstancePerLifetimeScope();
            builder.RegisterType<SurveyVersionMemoryRepository>().As<ISurveyVersionRepository>().InstancePerLifetimeScope();
            builder.RegisterType<ResourceStringMemoryRepository>().As<IResourceStringRepository>().InstancePerLifetimeScope();
            builder.RegisterType<DummyUnitOfWorkFactory>().As<IUnitOfWorkFactory>().InstancePerLifetimeScope();
            builder.RegisterModule<SurveyExecutionMemoryDataModule>();
        }
    }
}