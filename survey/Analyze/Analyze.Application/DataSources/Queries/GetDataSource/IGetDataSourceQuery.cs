using System.Threading.Tasks;
using Analyze.Domain.DataSources;

namespace Analyze.Application.DataSources.Queries.GetDataSource
{
	public interface IGetDataSourceQuery
	{
		Task<DataSource> Execute(string id);
	}
}