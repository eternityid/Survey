using Analyze.Domain.AggregationQueries;
using Analyze.Domain.DataSources;

namespace Analyze.Domain.Services
{
    public interface IAggregationQueryValidator
    {
	    void Validate(AggregationQuery aggregationQuery, DataSource dataSource);
	}
}
