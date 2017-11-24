using System.Web.Http;
using LearningPlatform.Application.ReportDesign;
using LearningPlatform.Domain.ReportDesign;
using LearningPlatform.Result;

namespace LearningPlatform.Api.Reports
{
    /// <summary>
    ///
    /// </summary>
    [Authorize]
    [RoutePrefix("api/reports/{reportId}/definition")]
    public class ReportDefinitionController : BaseApiController
    {
        private readonly ReportDefinitionAppService _reportDefinitionAppService;

        public ReportDefinitionController(ReportDefinitionAppService reportDefinitionAppService)
        {
            _reportDefinitionAppService = reportDefinitionAppService;
        }


        [Route("")]
        [HttpGet]
        public IHttpActionResult GetReport(long reportId)
        {
            ReportDefinition report = _reportDefinitionAppService.GetReportById(reportId);
            return Ok(report);
        }


        [Route("")]
        [HttpPost]
        public IHttpActionResult Post([FromBody] ReportDefinition reportDefinition)
        {
            return Ok(_reportDefinitionAppService.CreateReport(reportDefinition, CurrentUserId));
        }


        [Route("")]
        [HttpPut]
        public IHttpActionResult Put([FromBody] ReportDefinition reportDefinition)
        {
            _reportDefinitionAppService.UpdateReport(reportDefinition, CurrentUserId);
            return Ok(HttpDataResult.Update());
        }

    }
}