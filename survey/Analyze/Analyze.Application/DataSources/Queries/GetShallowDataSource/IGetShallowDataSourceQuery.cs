using System.Threading.Tasks;

namespace Analyze.Application.DataSources.Queries.GetShallowDataSource
{
	public interface IGetShallowDataSourceQuery
	{
		Task<ShallowDataSourceModel> Execute(string id);
	}
}