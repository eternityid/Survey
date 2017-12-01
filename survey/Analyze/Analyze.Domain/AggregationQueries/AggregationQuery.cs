using System.Collections.Generic;
using Analyze.Domain.AggregationQueries.Dimensions;
using Analyze.Domain.AggregationQueries.Filters;
using Analyze.Domain.AggregationQueries.Measures;

namespace Analyze.Domain.AggregationQueries
{
	public class AggregationQuery
	{
		public string DataSourceId { get; set; }
		public List<Dimension> Dimensions { get; set; }
		public List<Measure> Measures { get; set; }
		public List<Filter> Filters { get; set; }
	}
}
