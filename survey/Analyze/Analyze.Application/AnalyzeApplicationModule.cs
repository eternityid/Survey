using Analyze.Application.Aggregation;
using Analyze.Application.Aggregation.Elasticsearch;
using Analyze.Application.DataSources.Queries.GetDataSource;
using Analyze.Application.DataSources.Queries.GetDataSourcesList;
using Analyze.Application.DataSources.Queries.GetShallowDataSource;
using Autofac;

namespace Analyze.Application
{
	public class AnalyzeApplicationModule : Module
	{
		protected override void Load(ContainerBuilder builder)
		{
			builder.RegisterType<ElasticAggregationQueryFactory>().As<IElasticAggregationQueryFactory>().InstancePerLifetimeScope();
			builder.RegisterType<ElasticFilterFactory>().As<IElasticFilterFactory>().InstancePerLifetimeScope();
			builder.RegisterType<ElasticAggregationResultExtractor>().As<IElasticAggregationResultExtractor>().InstancePerLifetimeScope();

			//CRQS: Queries
			builder.RegisterType<GetDataSourcesListQuery>().As<IGetDataSourcesListQuery>().InstancePerLifetimeScope();
			builder.RegisterType<GetShallowDataSourceQuery>().As<IGetShallowDataSourceQuery>().InstancePerLifetimeScope();
			builder.RegisterType<GetDataSourceQuery>().As<IGetDataSourceQuery>().InstancePerLifetimeScope();
			builder.RegisterType<GetAggregationResultQuery>().As<IGetAggregationResultQuery>().InstancePerLifetimeScope();

			//CRQS: Commands
		}
	}
}
