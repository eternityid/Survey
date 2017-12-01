namespace Analyze.Application.Aggregation.Elasticsearch
{
	public interface IElasticAggregationResultExtractor
	{
		AggregationResultModel ExtractAggregationResult(dynamic elasticAggregationResult, ElasticAggregationContext context);
	}
}