using System.Linq;
using Analyze.Domain.AggregationQueries.Dimensions;
using Newtonsoft.Json.Linq;

namespace Analyze.Application.Aggregation.Elasticsearch
{
	public class ElasticAggregationQueryFactory : IElasticAggregationQueryFactory
	{
		private readonly IElasticFilterFactory _elasticFilterFactory;
		public ElasticAggregationQueryFactory(IElasticFilterFactory elasticFilterFactory)
		{
			_elasticFilterFactory = elasticFilterFactory;
		}

		public JObject CreateAggregationQuery(ElasticAggregationContext context)
		{
			return new JObject
			{
				{"size", 0 },
				{"query", BuildElasticQuery(context)},
				{"aggs",  BuildElasticAggregations(context)}
			};
		}

		private JObject BuildElasticQuery(ElasticAggregationContext context)
		{
			if (!context.Filters.Any()) return new JObject();

			var elasticFilterCollection = new JArray();
			foreach (var filter in context.Filters)
			{
				var elasticColumnName = context.FieldNamesMap[filter.FieldName].ElasticColumnName;
				var elasticFilter = _elasticFilterFactory.CreateFilter(elasticColumnName, filter);
				elasticFilterCollection.Add(elasticFilter);
			}

			return new JObject
			{
				{"bool", new JObject
				{
					{"filter", elasticFilterCollection }
				} }
			};
		}

		private JObject BuildElasticAggregations(ElasticAggregationContext context)
		{
			var metricsAggregations = BuildElasticMetricsAggregations(context);
			var bucketAggregations = BuildElasticBucketAggregations(context, metricsAggregations);
			return bucketAggregations;
		}

		private JObject BuildElasticMetricsAggregations(ElasticAggregationContext context)
		{
			var jObjectAggregations = new JObject();
			foreach (var measure in context.Measures)
			{
				var metricsAggregation = ElasticsMetricsAggregations.GetMetricsAggregation(measure.Operator);
				var elasticColumnName = context.FieldNamesMap[measure.FieldName].ElasticColumnName;
				jObjectAggregations[measure.GetHashValue()] = new JObject
				{
					[metricsAggregation] = new JObject
					{
						{"field", elasticColumnName}
					}
				};
			}
			return jObjectAggregations;
		}

		private JObject BuildElasticBucketAggregations(ElasticAggregationContext context, JObject nestedAggregations)
		{
			var bucketAggregations = (JObject)nestedAggregations.DeepClone();
			foreach (var dimension in context.Dimensions.ToArray().Reverse())
			{
				var elasticColumnName = context.FieldNamesMap[dimension.FieldName].ElasticColumnName;
				bucketAggregations = new JObject
				{
					{dimension.FieldName, new JObject
					{
						{"aggs", bucketAggregations}
					}}
				};
				if (dimension.Type == DimensionType.Date)
				{
					bucketAggregations[dimension.FieldName][ElasticBucketAggregations.DateHistogram] = new JObject
					{
						{"field", elasticColumnName},
						{"interval", dimension.DateInterval.ToString().ToLower()}
					};
				}
				else
				{
					bucketAggregations[dimension.FieldName][ElasticBucketAggregations.Terms] = new JObject
					{
						{"field", elasticColumnName}
					};
				}
			}
			return bucketAggregations;
		}
	}
}
