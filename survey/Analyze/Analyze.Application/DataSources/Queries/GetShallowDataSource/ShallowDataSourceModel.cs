using System.Collections.Generic;

namespace Analyze.Application.DataSources.Queries.GetShallowDataSource
{
	public class ShallowDataSourceModel
	{
		public string Id { get; set; }
		public IEnumerable<ShallowDataSourceFieldsListItemModel> Fields { get; set; }	
	}
}