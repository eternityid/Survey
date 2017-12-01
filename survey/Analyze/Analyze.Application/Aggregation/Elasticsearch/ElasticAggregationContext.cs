using System.Collections.Generic;
using Analyze.Domain.AggregationQueries;
using Analyze.Domain.AggregationQueries.Dimensions;
using Analyze.Domain.AggregationQueries.Filters;
using Analyze.Domain.AggregationQueries.Measures;
using Analyze.Domain.DataSources;
using Analyze.Domain.Exceptions;

namespace Analyze.Application.Aggregation.Elasticsearch
{
	public class ElasticAggregationContext
	{
		public readonly string DataSourceId;
		public IReadOnlyDictionary<string, Field> FieldNamesMap;

		private readonly List<Dimension> _dimensions;
		public IEnumerable<Dimension> Dimensions => _dimensions;
		private readonly List<Measure> _measures;
		public IEnumerable<Measure> Measures => _measures;
		private readonly List<Filter> _filters;
		public IEnumerable<Filter> Filters => _filters;

		public ElasticAggregationContext(AggregationQuery aggregationQuery, DataSource dataSource)
		{
			DataSourceId = dataSource?.Id ?? throw new AnalyzeDomainException("Data source cannot be null");
			FieldNamesMap = BuildFieldNamesMap(dataSource);

			_dimensions = aggregationQuery?.Dimensions ?? throw new AnalyzeDomainException("Aggregation query cannot be null");
			_measures = aggregationQuery.Measures;
			_filters = aggregationQuery.Filters;
		}

		public Dictionary<string, Field> BuildFieldNamesMap(DataSource dataSource)
		{
			var fieldNamesMap = new Dictionary<string, Field>();
			foreach (var field in dataSource.Fields)
			{
				fieldNamesMap[field.Name] = field;
			}
			return fieldNamesMap;
		}

		public Dimension FindNextDimension(Dimension currentDimension)
		{
			var currentDimensionIndex = _dimensions.IndexOf(currentDimension);
			var nextDimensionIndex = currentDimensionIndex + 1;
			return nextDimensionIndex == _dimensions.Count ? null : _dimensions[nextDimensionIndex];
		}
	}
}
