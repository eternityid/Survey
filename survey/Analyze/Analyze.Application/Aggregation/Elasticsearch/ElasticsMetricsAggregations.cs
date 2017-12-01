using Analyze.Domain.AggregationQueries.Measures;
using Analyze.Domain.Exceptions;

namespace Analyze.Application.Aggregation.Elasticsearch
{
	public static class ElasticsMetricsAggregations
	{
		public static string Sum = "sum";
		public static string Average = "avg";
		public static string Minimum = "min";
		public static string Maximum = "max";
		public static string Percentiles = "percentiles";
		public static string ValueCount = "value_count";
		public static string Cardinality = "cardinality";
		public static string ExtendedStats = "extended_stats";

		public static string GetMetricsAggregation(MeasureOperator measureOperator)
		{
			switch (measureOperator)
			{
				case MeasureOperator.Sum:
					return Sum;
				case MeasureOperator.Average:
					return Average;
				case MeasureOperator.Minimum:
					return Minimum;
				case MeasureOperator.Maximum:
					return Maximum;
				case MeasureOperator.Percentiles:
					return Percentiles;
				case MeasureOperator.CountDistinct:
					return Cardinality;
				case MeasureOperator.Count:
					return ValueCount;
				case MeasureOperator.StandardDeviation:
				case MeasureOperator.Variance:
					return ExtendedStats;
				default:
					throw new AnalyzeDomainException($"Measure operator '{measureOperator}' is unsupported");
			}
		}
	}
}