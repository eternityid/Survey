using System.Collections.Generic;
using System.Threading.Tasks;

namespace Analyze.Application.DataSources.Queries.GetDataSourcesList
{
	public interface IGetDataSourcesListQuery
	{
		Task<List<DataSourcesListItemModel>> Execute();
	}
}
