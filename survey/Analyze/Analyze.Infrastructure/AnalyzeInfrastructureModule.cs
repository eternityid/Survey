using Analyze.Infrastructure.Elasticsearch;
using Autofac;
using Microsoft.Extensions.Configuration;
using Nest;

namespace Analyze.Infrastructure
{
	public class AnalyzeInfrastructureModule : Module
	{
		public IConfiguration Configuration { get; set; }
		protected override void Load(ContainerBuilder builder)
		{
			builder.Register(c => ElasticClientFactory.Create(Configuration)).As<IElasticClient>().SingleInstance();
		}
	}
}
