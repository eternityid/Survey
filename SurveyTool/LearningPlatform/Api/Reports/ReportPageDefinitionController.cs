using LearningPlatform.Application.ReportDesign;
using LearningPlatform.Application.ReportDesign.Models;
using LearningPlatform.Domain.ReportDesign;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Result;
using System.Web.Http;

namespace LearningPlatform.Api.Reports
{
    [Authorize]
    [RoutePrefix("api/reports/{reportId}/definition/pages")]
    public class ReportPageDefinitionController: BaseApiController
    {
        private readonly ReportDefinitionAppService _reportDefinitionAppService;
        private readonly RespondentsReportingAppService _respondentsReportingAppService;

        public ReportPageDefinitionController(ReportDefinitionAppService reportDefinitionAppService,
            RespondentsReportingAppService respondentsReportingAppService)
        {
            _reportDefinitionAppService = reportDefinitionAppService;
            _respondentsReportingAppService = respondentsReportingAppService;
        }

        //TODO: Move code to app service
        [Route("")]
        [HttpGet]
        public IHttpActionResult Get(long reportId, bool testMode)
        {
            var report = _reportDefinitionAppService.GetReportById(reportId);

            var reportPages = _reportDefinitionAppService.GetPagesByReportId(reportId);
            var aggregatedRespondents = _respondentsReportingAppService.GetAggregatedRespondents(report.SurveyId, CurrentUserId, testMode);
            var openTextRespondents = _respondentsReportingAppService.GetOpenTextRespondents(report.SurveyId,
                aggregatedRespondents, testMode);

            var questions = _reportDefinitionAppService.GetReportQuestions(reportId, testMode);
            var reportPagesResult = new ReportPagesViewModel
            {
                SurveyId = report.SurveyId,
                ReportId = report.Id,
                Name = report.Name,
                Pages = reportPages,
                Data = aggregatedRespondents,
                OpenTextRespondents = openTextRespondents,
                Questions = questions
            };
            return Ok(reportPagesResult);
        }

        [Route("")]
        [HttpPost]
        public IHttpActionResult Post([FromBody] ReportPageDefinition reportPageDefinition)
        {
            _reportDefinitionAppService.AddReportPageDefinition(reportPageDefinition);

            return Ok(HttpDataResult.Create(reportPageDefinition.Id));
        }

        [Route("{pageId}")]
        [HttpDelete]
        public IHttpActionResult Delete(long pageId)
        {
            _reportDefinitionAppService.DeleteReportPageDefinition(pageId);
            return Ok(HttpDataResult.Delete());
        }

        [Route("move")]
        [HttpPatch]
        public IHttpActionResult MoveReportPage([FromBody]MoveReportPage moveReportPage)
        {
            _reportDefinitionAppService.UpdatePosition(moveReportPage);
            return Ok(HttpDataResult.Update());
        }

        [Route("questions")]
        [HttpGet]
        public IHttpActionResult GetQuestionForChart(long reportId, bool testMode)
        {
            var questions = _respondentsReportingAppService.GetReportQuestions(reportId, CurrentUserId, testMode);
            return Ok(questions);
        }
    }
}