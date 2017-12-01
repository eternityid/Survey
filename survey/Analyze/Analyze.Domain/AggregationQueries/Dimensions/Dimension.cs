namespace Analyze.Domain.AggregationQueries.Dimensions
{
	public class Dimension
	{
		public DimensionType Type { get; set; }
		public string FieldName { get; set; }
		public DateDimensionInterval? DateInterval { get; set; }
	}
}
