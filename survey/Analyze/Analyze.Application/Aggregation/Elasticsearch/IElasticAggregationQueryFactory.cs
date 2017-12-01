using Newtonsoft.Json.Linq;

namespace Analyze.Application.Aggregation.Elasticsearch
{
    public interface IElasticAggregationQueryFactory
    {
	    JObject CreateAggregationQuery(ElasticAggregationContext context);
    }
}
