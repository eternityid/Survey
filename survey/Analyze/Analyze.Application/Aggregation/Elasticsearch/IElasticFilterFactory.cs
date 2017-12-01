using Analyze.Domain.AggregationQueries.Filters;
using Newtonsoft.Json.Linq;

namespace Analyze.Application.Aggregation.Elasticsearch
{
	public interface IElasticFilterFactory
	{
		JObject CreateFilter(string elasticColumnName, Filter filter);
	}
}
