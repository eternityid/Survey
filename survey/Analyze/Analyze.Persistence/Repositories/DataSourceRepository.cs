using System.Threading.Tasks;
using Analyze.Application.Interfaces;
using Analyze.Domain.DataSources;
using MongoDB.Driver;

namespace Analyze.Persistence.Repositories
{
	public class DataSourceRepository : IDataSourceRepository
	{
		private readonly IAnalyzeDbContext _dbContext;

		public DataSourceRepository(IAnalyzeDbContext dbContext)
		{
			_dbContext = dbContext;
		}

		public async Task<DataSource> FindByIdAsync(string id)
		{
			var filter = Builders<DataSource>.Filter.Eq(p => p.Id, id);
			return await _dbContext.DataSourceCollection
				.Find(filter)
				.FirstOrDefaultAsync();
		}
	}
}
