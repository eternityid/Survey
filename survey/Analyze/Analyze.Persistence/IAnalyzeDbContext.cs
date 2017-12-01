using Analyze.Domain.DataSources;
using MongoDB.Driver;

namespace Analyze.Persistence
{
	public interface IAnalyzeDbContext
	{
		IMongoCollection<DataSource> DataSourceCollection { get; }
	}
}
