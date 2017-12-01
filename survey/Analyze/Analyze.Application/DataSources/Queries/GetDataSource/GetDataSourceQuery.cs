using System.Threading.Tasks;
using Analyze.Application.Interfaces;
using Analyze.Domain.DataSources;
using MongoDB.Driver.Linq;

namespace Analyze.Application.DataSources.Queries.GetDataSource
{
    public class GetDataSourceQuery: IGetDataSourceQuery
    {
	    private readonly IAnalyzeReadOnlyDbContext _analyzeReadOnlyDbContext;

	    public GetDataSourceQuery(IAnalyzeReadOnlyDbContext analyzeReadOnlyDbContext)
	    {
		    _analyzeReadOnlyDbContext = analyzeReadOnlyDbContext;
	    }

	    public async Task<DataSource> Execute(string id)
	    {
		    return await _analyzeReadOnlyDbContext
			    .DataSourceQueryable
			    .SingleOrDefaultAsync(dataSource => dataSource.Id == id);
	    }
	}
}
