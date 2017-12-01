using Analyze.Application.Interfaces;
using Analyze.Persistence.Repositories;
using Autofac;

namespace Analyze.Persistence
{
	public class AnalyzePersistenceModule : Module
	{
		protected override void Load(ContainerBuilder builder)
		{
			builder.RegisterType<AnalyzeDbContext>()
				.As<IAnalyzeDbContext>()
				.As<IAnalyzeReadOnlyDbContext>()
				.SingleInstance();
			builder.RegisterType<DataSourceRepository>().As<IDataSourceRepository>().InstancePerLifetimeScope();

			AnalyzeDbContextMapping.Map();
		}
	}
}
