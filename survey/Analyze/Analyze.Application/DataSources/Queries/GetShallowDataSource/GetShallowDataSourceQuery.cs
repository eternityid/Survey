using System.Linq;
using System.Threading.Tasks;
using Analyze.Application.Interfaces;
using MongoDB.Driver.Linq;

namespace Analyze.Application.DataSources.Queries.GetShallowDataSource
{
	public class GetShallowDataSourceQuery : IGetShallowDataSourceQuery
	{
		private readonly IAnalyzeReadOnlyDbContext _analyzeReadOnlyDbContext;

		public GetShallowDataSourceQuery(IAnalyzeReadOnlyDbContext analyzeReadOnlyDbContext)
		{
			_analyzeReadOnlyDbContext = analyzeReadOnlyDbContext;
		}

		public async Task<ShallowDataSourceModel> Execute(string id)
		{
			return await _analyzeReadOnlyDbContext
				.DataSourceQueryable
				.Select(dataSource => new ShallowDataSourceModel
				{
					Id = dataSource.Id,
					Fields = dataSource.Fields.Select(field => new ShallowDataSourceFieldsListItemModel
					{
						Name = field.Name,
						Title = field.Title,
						Type = field.Type
					})
				})
				.SingleOrDefaultAsync(p => p.Id == id);
		}
	}
}
