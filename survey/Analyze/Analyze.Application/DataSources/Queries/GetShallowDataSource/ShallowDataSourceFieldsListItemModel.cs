using Analyze.Domain.DataSources;

namespace Analyze.Application.DataSources.Queries.GetShallowDataSource
{
	public class ShallowDataSourceFieldsListItemModel
	{
		public string Name { get; set; }
		public LanguageString Title { get; set; }
		public FieldType Type { get; set; }
	}
}