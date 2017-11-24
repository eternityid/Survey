using Autofac;
using LearningPlatform.Domain.SurveyExecution.RepositoryContracts;
using LearningPlatform.SurveyExecution.Data.Repositories.Memory;

namespace LearningPlatform.SurveyExecution.Data
{
    public class SurveyExecutionMemoryDataModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<RespondentMemoryRepository>().As<IRespondentSurveyExecutionRepository>().InstancePerLifetimeScope();
            builder.RegisterType<ResponseRowMemoryRepository>().As<IResponseRowRepository>().InstancePerLifetimeScope();
        }
    }
}