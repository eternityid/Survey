using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using LearningPlatform.Application.Models;
using LearningPlatform.Domain.ReportDesign;

namespace LearningPlatform.Api.Reports
{
    //TODO: Move code to app service
    [Authorize]
    [RoutePrefix("api/reports/{reportId}/definition/elements")]
    public class ReportElementDefinitionController: ApiController
    {
        private readonly ReportDefinitionService _reportDefinitionService;
        private readonly ReportElementDefinitionService _reportElementDefinitionService;

        public ReportElementDefinitionController(ReportDefinitionService reportDefinitionService, ReportElementDefinitionService reportElementDefinitionService)
        {
            _reportDefinitionService = reportDefinitionService;
            _reportElementDefinitionService = reportElementDefinitionService;
        }

        [Route("")]
        [HttpPost]
        public HttpResponseMessage Post([FromBody] ReportElementDefinition reportElementDefinition)
        {
            var newReport = _reportElementDefinitionService.AddReportElementDefinition(reportElementDefinition);
            return Request.CreateResponse(newReport);
        }

        [Route("{elementId}")]
        [HttpDelete]
        public HttpResponseMessage Delete(long elementId)
        {
            _reportDefinitionService.DeleteReportElementDefinition(elementId);
            return Request.CreateResponse(HttpStatusCode.OK, "ReportElementDefinition deleted.");
        }

        [Route("")]
        [HttpPut]
        public HttpResponseMessage Put([FromBody] ReportElementDefinition reportElementDefinition)
        {
            var updatedElement = _reportElementDefinitionService.UpdateReportElementDefinition(reportElementDefinition);
            return Request.CreateResponse(updatedElement);
        }

        [Route("{elementId}/position")]
        [HttpPatch]
        public HttpResponseMessage Patch(long elementId, [FromBody] ElementPosition position)
        {
            var element = _reportElementDefinitionService.UpdateReportElementDefinitionPosition(elementId, position.X, position.Y);
            return Request.CreateResponse(element);
        }

        [Route("{elementId}/positions")]
        [HttpPatch]
        public HttpResponseMessage Patch(long elementId, IEnumerable<ReportElementPositionModel> positions)
        {
            ReportElementDefinition currentElement = null;
            var matchElementPosition = positions.FirstOrDefault(elementPosition => elementPosition.ElementId == elementId);
            if (matchElementPosition != null)
            {
                currentElement = _reportElementDefinitionService.UpdateReportElementDefinitionPosition(elementId,
                    matchElementPosition.X, matchElementPosition.Y);
            }
            return Request.CreateResponse(currentElement);
        }

        [Route("{elementId}/size")]
        [HttpPatch]
        public HttpResponseMessage Patch(long elementId, [FromBody] ReportElementPositionAndSizeModel positionAndSize)
        {
            var elementPosition = new ElementPosition(positionAndSize.X, positionAndSize.Y, positionAndSize.Z);
            var elementSize = new ElementSize(positionAndSize.Width, positionAndSize.Height);

            var element = _reportElementDefinitionService.UpdateReportElementDefinitionPositionAndSize(elementId,
                elementPosition, elementSize);
            return Request.CreateResponse(element);
        }
    }
}