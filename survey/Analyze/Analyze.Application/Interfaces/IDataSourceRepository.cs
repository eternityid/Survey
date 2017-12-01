using System.Threading.Tasks;
using Analyze.Domain.DataSources;

namespace Analyze.Application.Interfaces
{
	public interface IDataSourceRepository
	{
		Task<DataSource> FindByIdAsync(string id);
	}
}
