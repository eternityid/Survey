using System;
using Microsoft.Extensions.Configuration;
using Nest;

namespace Analyze.Infrastructure.Elasticsearch
{
	public static class ElasticClientFactory
	{
		public static ElasticClient Create(IConfiguration configuration)
		{
			var uri = new Uri(configuration["Elasticsearch:ConnectionString"]);
			var connectionSettings = new ConnectionSettings(uri);
			return new ElasticClient(connectionSettings);
		}
	}
}
