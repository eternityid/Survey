using System.Web.Http;
using LearningPlatform.Domain.ReportDesign;
using LearningPlatform.Domain.ReportDesign.ReportEditedLabel;

namespace LearningPlatform.Api.Reports
{
    //TODO: Move code to app service
    [Authorize]
    [RoutePrefix("api/reports/{reportId}/elements/{reportElementId}/definition/editedlabels")]
    public class ReportEditedLabelDefinitionController: ApiController
    {
        private readonly ReportEditedLabelDefinitionService _reportEditedLabelDefinitionService;
        private readonly ReportElementDefinitionService _reportElementDefinitionService;

        public ReportEditedLabelDefinitionController(ReportEditedLabelDefinitionService reportEditedLabelDefinitionService, ReportElementDefinitionService reportElementDefinitionService)
        {
            _reportEditedLabelDefinitionService = reportEditedLabelDefinitionService;
            _reportElementDefinitionService = reportElementDefinitionService;
        }

        [Route("")]
        [HttpPost]
        public IHttpActionResult Post(long reportElementId, [FromBody] ReportEditedLabelDefinition reportEditedLabelDefinition)
        {
            if (reportElementId != reportEditedLabelDefinition.ReportElementHasQuestionId) return BadRequest();

            var reportElement = _reportElementDefinitionService.GetReportElementDefinition(reportElementId);
            if (reportElement == null) return BadRequest();

            _reportEditedLabelDefinitionService.Add(reportEditedLabelDefinition);

            return Ok(reportEditedLabelDefinition);
        }

        [Route("{reportEditedLabelId}")]
        [HttpDelete]
        public IHttpActionResult Delete(long reportEditedLabelId)
        {
            var reportEditedLabel = _reportEditedLabelDefinitionService.GetById(reportEditedLabelId);
            if (reportEditedLabel == null) return NotFound();

            _reportEditedLabelDefinitionService.Delete(reportEditedLabelId);

            return Ok(reportEditedLabel);
        }

        [Route("{reportEditedLabelId}")]
        [HttpPatch]
        public IHttpActionResult Patch(long reportEditedLabelId, [FromBody] ReportEditedLabelDefinition reportEditedLabelDefinition)
        {
            var reportEditedLabel = _reportEditedLabelDefinitionService.GetById(reportEditedLabelId);
            if (reportEditedLabel == null) return NotFound();

            reportEditedLabel.LatestContent = reportEditedLabelDefinition.LatestContent;
            _reportEditedLabelDefinitionService.Update(reportEditedLabel);

            return Ok(reportEditedLabel);
        }

        [Route("")]
        [HttpGet]
        public IHttpActionResult GetReportEditedLabels(long reportElementId)
        {
            var reportElement = _reportElementDefinitionService.GetReportElementDefinition(reportElementId);
            if (reportElement == null) return NotFound();

            var reportEditedLabels = _reportEditedLabelDefinitionService.GetEditedLabelsByReportElementId(reportElementId);
            return Ok(reportEditedLabels);
        }
    }
}