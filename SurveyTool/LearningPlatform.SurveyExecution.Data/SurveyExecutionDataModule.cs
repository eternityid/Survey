using Autofac;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyExecution.RepositoryContracts;
using LearningPlatform.SurveyExecution.Data.Repositories.Sql;

namespace LearningPlatform.SurveyExecution.Data
{
    public class SurveyExecutionDataModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<RespondentSurveyExecutionSqlRepository>().As<IRespondentSurveyExecutionRepository>().InstancePerLifetimeScope();
            builder.RegisterType<ResponseRowSqlRepository>().As<IResponseRowRepository>().InstancePerLifetimeScope();
            builder.RegisterType<BulkCopyResponses>().As<IBulkCopyResponses>().InstancePerLifetimeScope();
        }
    }
}