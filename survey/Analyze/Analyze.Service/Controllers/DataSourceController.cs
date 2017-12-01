using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Analyze.Application.Aggregation;
using Analyze.Application.DataSources.Queries.GetDataSource;
using Analyze.Application.DataSources.Queries.GetDataSourcesList;
using Analyze.Application.DataSources.Queries.GetShallowDataSource;
using Analyze.Domain.AggregationQueries;
using Analyze.Service.Common;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Analyze.Service.Controllers
{
	public class DataSourceController : Controller
	{
		private readonly IGetDataSourcesListQuery _getDataSourcesListQuery;
		private readonly IGetDataSourceQuery _getDataSourceQuery;
		private readonly IGetShallowDataSourceQuery _getShallowDataSourceQuery;
		private readonly IGetAggregationResultQuery _getAggregationResultQuery;

		public DataSourceController(IGetDataSourcesListQuery getDataSourcesListQuery,
			IGetDataSourceQuery getDataSourceQuery,
			IGetShallowDataSourceQuery getShallowDataSourceQuery,
			IGetAggregationResultQuery getAggregationResultQuery)
		{
			_getDataSourcesListQuery = getDataSourcesListQuery;
			_getDataSourceQuery = getDataSourceQuery;
			_getShallowDataSourceQuery = getShallowDataSourceQuery;
			_getAggregationResultQuery = getAggregationResultQuery;
		}

		[HttpGet("api/dataSources")]
		[SwaggerResponse((int)HttpStatusCode.Unauthorized)]
		[SwaggerResponse((int)HttpStatusCode.OK, typeof(IEnumerable<DataSourcesListItemModel>))]
		public async Task<IEnumerable<DataSourcesListItemModel>> GetDataSourcesList()
		{
			return await _getDataSourcesListQuery.Execute();
		}

		[HttpPost("api/dataSources:aggregate")]
		[SwaggerResponse((int)HttpStatusCode.Unauthorized)]
		[SwaggerResponse((int)HttpStatusCode.NotFound)]
		[SwaggerResponse((int)HttpStatusCode.OK, typeof(AggregationResultModel))]
		public async Task<IActionResult> Aggregate([FromBody] AggregationQuery aggregationQuery)
		{
			var dataSource = await _getDataSourceQuery.Execute(aggregationQuery.DataSourceId);
			if (dataSource == null) return NotFound(new JsonErrorResponse($"Data source '{aggregationQuery.DataSourceId}' is not found"));

			var aggregationResult = await _getAggregationResultQuery.Execute(dataSource, aggregationQuery);
			return Ok(aggregationResult);
		}

		[HttpGet("api/dataSources/{id}/fields")]
		[SwaggerResponse((int)HttpStatusCode.Unauthorized)]
		[SwaggerResponse((int)HttpStatusCode.NotFound)]
		[SwaggerResponse((int)HttpStatusCode.OK, typeof(IEnumerable<ShallowDataSourceFieldsListItemModel>))]
		public async Task<IActionResult> GetDataSourceFieldsList(string id)
		{
			var shallowDataSource = await _getShallowDataSourceQuery.Execute(id);
			if (shallowDataSource == null) return NotFound();

			return Ok(shallowDataSource.Fields);
		}
	}
}
