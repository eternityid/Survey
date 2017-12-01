using System.Threading.Tasks;
using Analyze.Domain.AggregationQueries;
using Analyze.Domain.DataSources;

namespace Analyze.Application.Aggregation
{
	public interface IGetAggregationResultQuery
	{
		Task<AggregationResultModel> Execute(DataSource dataSource, AggregationQuery aggregationQuery);
	}
}
