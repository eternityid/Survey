using Analyze.Domain.DataSources;
using MongoDB.Driver.Linq;

namespace Analyze.Application.Interfaces
{
	public interface IAnalyzeReadOnlyDbContext
	{
		IMongoQueryable<DataSource> DataSourceQueryable { get; }
	}
}
