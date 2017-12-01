using Analyze.Application.Interfaces;
using Analyze.Domain.DataSources;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Analyze.Persistence
{
	public class AnalyzeDbContext : IAnalyzeDbContext, IAnalyzeReadOnlyDbContext
	{
		private readonly IMongoDatabase _database;

		public AnalyzeDbContext(IConfiguration configuration)
		{
			var client = new MongoClient(configuration["MongoDB:ConnectionString"]);
			_database = client.GetDatabase(configuration["MongoDB:Database"]);
		}

		public IMongoCollection<DataSource> DataSourceCollection => _database.GetCollection<DataSource>("dataSources");
		public IMongoQueryable<DataSource> DataSourceQueryable => DataSourceCollection.AsQueryable();
	}
}
