using System.Collections.Generic;
using System.Linq;
using Analyze.Domain.AggregationQueries;
using Analyze.Domain.AggregationQueries.Dimensions;
using Analyze.Domain.AggregationQueries.Filters;
using Analyze.Domain.AggregationQueries.Measures;
using Analyze.Domain.DataSources;
using Analyze.Domain.Exceptions;

namespace Analyze.Domain.Services
{
	public class AggregationQueryValidator : IAggregationQueryValidator
	{
		public void Validate(AggregationQuery aggregationQuery, DataSource dataSource)
		{
			if (aggregationQuery == null) throw new AnalyzeDomainException("Aggregation query cannot be null");
			if (dataSource == null) throw new AnalyzeDomainException("Data source cannot be null");

			if (aggregationQuery.DataSourceId != dataSource.Id) throw new AnalyzeDomainException("Aggregation query's data source id is invalid");
			if (!aggregationQuery.Dimensions.Any()) throw new AnalyzeDomainException("Aggregation query's dimensions must have at least one element");
			if (!aggregationQuery.Measures.Any()) throw new AnalyzeDomainException("Aggregation query's measures must have at least one element");

			var fieldNamesMap = BuildDataSourceFieldNamesMap(dataSource);
			ValidateDimensions(aggregationQuery.Dimensions, fieldNamesMap);
			ValidateMeasures(aggregationQuery.Measures, fieldNamesMap);
			ValidateFilters(aggregationQuery.Filters, fieldNamesMap);
		}

		private Dictionary<string, Field> BuildDataSourceFieldNamesMap(DataSource dataSource)
		{
			var fieldNamesMap = new Dictionary<string, Field>();
			foreach (var field in dataSource.Fields)
			{
				fieldNamesMap[field.Name] = field;
			}
			return fieldNamesMap;
		}

		private void ValidateDimensions(IEnumerable<Dimension> dimensions, IReadOnlyDictionary<string, Field> fieldNamesMap)
		{
			var uniqueFieldNames = new HashSet<string>();
			foreach (var dimension in dimensions)
			{
				if (dimension == null) throw new AnalyzeDomainException("Dimension cannot be null");
				if (!fieldNamesMap.ContainsKey(dimension.FieldName)) throw new AnalyzeDomainException($"Dimension '{dimension.FieldName}' is not found");
				if (!uniqueFieldNames.Add(dimension.FieldName)) throw new AnalyzeDomainException($"Dimension '{dimension.FieldName}' is duplicated");
				if (dimension.Type == DimensionType.Date)
				{
					if (dimension.DateInterval == null) throw new AnalyzeDomainException($"Dimension '{dimension.FieldName}' interval cannot be null");
				}
				else
				{
					if (dimension.DateInterval != null) throw new AnalyzeDomainException($"Date interval is unsupported for dimension '{dimension.FieldName}'");
				}
			}
		}

		private void ValidateMeasures(IEnumerable<Measure> measures, IReadOnlyDictionary<string, Field> fieldNamesMap)
		{
			var uniqueHashValues = new HashSet<string>();
			foreach (var measure in measures)
			{
				if (measure == null) throw new AnalyzeDomainException("Measure cannot be null");
				if (!fieldNamesMap.TryGetValue(measure.FieldName, out var measureField))
					throw new AnalyzeDomainException($"Measure '{measure.FieldName}' is not found");
				if (measureField.Type != FieldType.Numeric && measure.FieldName != ReservedFieldNames.ResponseId)
					throw new AnalyzeDomainException($"Measure '{measure.FieldName}' is unsupported");
				if (measure.FieldName == ReservedFieldNames.ResponseId && measure.Operator != MeasureOperator.Count)
					throw new AnalyzeDomainException($"Operator '{measure.Operator.ToString()}' is unsupported for measure '{measure.FieldName}'");
				var hashValue = measure.GetHashValue();
				if (!uniqueHashValues.Add(hashValue)) throw new AnalyzeDomainException($"Measure '{measure.FieldName}' with operator '{measure.Operator.ToString()}' is duplicated");
			}
		}

		private void ValidateFilters(IEnumerable<Filter> filters, IReadOnlyDictionary<string, Field> fieldNamesMap)
		{
			var uniqueFieldNames = new HashSet<string>();
			foreach (var filter in filters)
			{
				if (filter == null) throw new AnalyzeDomainException("Filter cannot be null");
				if (!fieldNamesMap.ContainsKey(filter.FieldName)) throw new AnalyzeDomainException($"Filter '{filter.FieldName}' is not found");
				if (!uniqueFieldNames.Add(filter.FieldName)) throw new AnalyzeDomainException($"Filter '{filter.FieldName}' is duplicated");
			}
		}
	}
}
