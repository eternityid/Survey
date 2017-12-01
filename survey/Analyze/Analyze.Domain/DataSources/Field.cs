using System.Collections.Generic;

namespace Analyze.Domain.DataSources
{
	public class Field
	{
		public string ExternalId { get; set; }
		public string ElasticColumnName { get; set; }
		public string Name { get; set; }
		public LanguageString Title { get; set; }
		public FieldType Type { get; set; }
		public List<FieldLegalValue> LegalValues { get; set; }
	}
}