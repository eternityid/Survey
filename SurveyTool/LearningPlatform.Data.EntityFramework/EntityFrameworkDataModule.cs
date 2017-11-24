using Autofac;
using LearningPlatform.Data.EntityFramework.Repositories;
using LearningPlatform.Data.EntityFramework.ResponsesDb;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.ReportDesign;
using LearningPlatform.Domain.ReportDesign.ReportEditedLabel;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyPublishing;

namespace LearningPlatform.Data.EntityFramework
{
    public class EntityFrameworkDataModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            RegisterContexts(builder);
            RegisterRepositories(builder);
            builder.RegisterType<UnitOfWorkFactory>().As<IUnitOfWorkFactory>().InstancePerLifetimeScope();
        }

        private static void RegisterRepositories(ContainerBuilder builder)
        {
            builder.RegisterType<RespondentSqlRepository>().As<IRespondentRepository>().InstancePerLifetimeScope();
            builder.RegisterType<SurveyVersionRepository>().As<ISurveyVersionRepository>().InstancePerLifetimeScope();
            builder.RegisterType<ReportPageDefinitionSqlRepository>().As<IReportPageDefinitionRepository>().InstancePerLifetimeScope();
            builder.RegisterType<ReportDefinitionSqlRepository>().As<IReportDefinitionRepository>().InstancePerLifetimeScope();
            builder.RegisterType<ReportEditedLabelDefinitionSqlRepository>().As<IReportEditedLabelDefinitionRepository>().InstancePerLifetimeScope();
            builder.RegisterType<ReportElementDefinitionSqlRepository>().As<IReportElementDefinitionRepository>().InstancePerLifetimeScope();
            builder.RegisterType<ResourceStringRepository>().As<IResourceStringRepository>().InstancePerLifetimeScope();

        }

        private static void RegisterContexts(ContainerBuilder builder)
        {
            builder.RegisterType<ResponsesContextProvider>().InstancePerLifetimeScope();
            builder.RegisterType<SurveysContextProvider>().InstancePerLifetimeScope();
            builder.RegisterType<RequestObjectProvider<ResponsesContext>>().As<IRequestObjectProvider<ResponsesContext>>().InstancePerLifetimeScope();
            builder.RegisterType<RequestObjectProvider<TestResponsesContext>>().As<IRequestObjectProvider<TestResponsesContext>>().InstancePerLifetimeScope();
            builder.RegisterType<RequestObjectProvider<SurveysDb.SurveysContext>>().As<IRequestObjectProvider<SurveysDb.SurveysContext>>().InstancePerLifetimeScope();
        }
    }
}