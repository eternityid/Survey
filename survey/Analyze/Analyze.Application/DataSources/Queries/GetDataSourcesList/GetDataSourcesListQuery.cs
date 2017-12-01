using System.Collections.Generic;
using System.Threading.Tasks;
using Analyze.Application.Interfaces;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Analyze.Application.DataSources.Queries.GetDataSourcesList
{
	public class GetDataSourcesListQuery : IGetDataSourcesListQuery
	{
		private readonly IAnalyzeReadOnlyDbContext _analyzeReadOnlyDbContext;

		public GetDataSourcesListQuery(IAnalyzeReadOnlyDbContext analyzeReadOnlyDbContext)
		{
			_analyzeReadOnlyDbContext = analyzeReadOnlyDbContext;
		}

		public async Task<List<DataSourcesListItemModel>> Execute()
		{
			return await _analyzeReadOnlyDbContext
				.DataSourceQueryable
				.Select(dataSource => new DataSourcesListItemModel
				{
					Id = dataSource.Id,
					Title = dataSource.Title
				})
				.ToListAsync();
		}
	}
}