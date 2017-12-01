namespace Analyze.Domain.AggregationQueries.Measures
{
	public class Measure
	{
		public string FieldName { get; set; }
		public MeasureOperator Operator { get; set; }

		public string GetHashValue()
		{
			return $"{FieldName}:{Operator.ToString()}";
		}
	}
}
