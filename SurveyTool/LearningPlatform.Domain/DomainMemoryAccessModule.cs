using Autofac;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyExecution.Request;

namespace LearningPlatform.Domain
{
    /// <summary>
    /// This access module is needed by Random Data Generator
    /// </summary>
    public class DomainMemoryAccessModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<NodeServiceMemoryCache>().As<INodeServiceCache>().InstancePerLifetimeScope();
            builder.RegisterType<DummyRequestObjectProvider<IRequestContext>>().As<IRequestObjectProvider<IRequestContext>>().InstancePerLifetimeScope();
        }
    }
}