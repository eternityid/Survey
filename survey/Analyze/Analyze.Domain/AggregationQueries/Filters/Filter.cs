namespace Analyze.Domain.AggregationQueries.Filters
{
	public class Filter
	{
		public FilterType Type { get; set; }
		public dynamic Value { get; set; }
		public string FieldName { get; set; }
	}
}
