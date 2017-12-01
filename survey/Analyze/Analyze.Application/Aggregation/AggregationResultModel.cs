using System.Collections.Generic;
using Analyze.Domain.AggregationQueries.Dimensions;
using Analyze.Domain.AggregationQueries.Filters;
using Analyze.Domain.AggregationQueries.Measures;
using Analyze.Domain.DataSources;
using Newtonsoft.Json.Linq;

namespace Analyze.Application.Aggregation
{
	public class AggregationResultModel
	{
		public string DataSourceId { get; set; }
		public IEnumerable<Dimension> Dimensions { get; set; }
		public IEnumerable<Measure> Measures { get; set; }
		public IEnumerable<Filter> Filters { get; set; }
		public List<JObject> Documents { get; set; }
		public Dictionary<string, LanguageString> FieldsDictionary { get; set; }
		public Dictionary<string, Dictionary<string, LanguageString>> FieldAnswersDictionary { get; set; }
	}
}