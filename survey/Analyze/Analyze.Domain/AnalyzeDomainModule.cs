using Analyze.Domain.Services;
using Autofac;

namespace Analyze.Domain
{
	public class AnalyzeDomainModule : Module
	{
		protected override void Load(ContainerBuilder builder)
		{
			builder.RegisterType<AggregationQueryValidator>().As<IAggregationQueryValidator>().InstancePerLifetimeScope();
		}
	}
}
