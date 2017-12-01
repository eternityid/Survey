using System.Threading.Tasks;
using Analyze.Application.Aggregation.Elasticsearch;
using Analyze.Domain.AggregationQueries;
using Analyze.Domain.DataSources;
using Analyze.Domain.Exceptions;
using Analyze.Domain.Services;
using Nest;

namespace Analyze.Application.Aggregation
{
	public class GetAggregationResultQuery : IGetAggregationResultQuery
	{
		private readonly IElasticClient _elasticClient;
		private readonly IAggregationQueryValidator _aggregationQueryValidator;
		private readonly IElasticAggregationQueryFactory _elasticAggregationQueryFactory;
		private readonly IElasticAggregationResultExtractor _elasticAggregationResultExtractor;

		public GetAggregationResultQuery(IElasticClient elasticClient,
			IAggregationQueryValidator aggregationQueryValidator, 
			IElasticAggregationQueryFactory elasticAggregationQueryFactory, 
			IElasticAggregationResultExtractor elasticAggregationResultExtractor)
		{
			_elasticClient = elasticClient;
			_aggregationQueryValidator = aggregationQueryValidator;
			_elasticAggregationQueryFactory = elasticAggregationQueryFactory;
			_elasticAggregationResultExtractor = elasticAggregationResultExtractor;
		}

		public async Task<AggregationResultModel> Execute(DataSource dataSource, AggregationQuery aggregationQuery)
		{
			_aggregationQueryValidator.Validate(aggregationQuery, dataSource);
			var elasticAggregationContext = new ElasticAggregationContext(aggregationQuery, dataSource);

			var elasticAggregationQuery = _elasticAggregationQueryFactory.CreateAggregationQuery(elasticAggregationContext);
			var elasticResponse = await _elasticClient
				.LowLevel
				.SearchAsync<dynamic>($"survey_{dataSource.ExternalId}", "responses", elasticAggregationQuery.ToString());
			if (!elasticResponse.Success)
			{
				if (elasticResponse.ServerError != null) throw new AnalyzeDomainException(elasticResponse.ServerError.ToString());
				throw new AnalyzeDomainException(elasticResponse.OriginalException.Message);
			}
			return _elasticAggregationResultExtractor.ExtractAggregationResult(elasticResponse.Body["aggregations"], elasticAggregationContext);
		}
	}
}