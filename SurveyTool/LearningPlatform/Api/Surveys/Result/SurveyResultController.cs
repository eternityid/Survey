using LearningPlatform.Application.ReportDesign;
using LearningPlatform.Application.ReportDesign.Models;
using LearningPlatform.Application.SurveyDesign;
using LearningPlatform.Domain.Reporting.Respondents;
using LearningPlatform.Result;
using Swashbuckle.Swagger.Annotations;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LearningPlatform.Api.Surveys.Result
{
    [Authorize]
    [RoutePrefix("api/surveys/{surveyId}/result")]
    public class SurveyResultController : BaseApiController
    {
        private readonly RespondentsReportingAppService _respondentsReportingAppService;
        private readonly ReportPageDefinitionAppService _reportPageDefinitionAppService; //TODO: remove?
        private readonly SurveyDefinitionAppService _surveyDefinitionAppService;

        public SurveyResultController(RespondentsReportingAppService respondentsReportingAppService,
            ReportPageDefinitionAppService reportPageDefinitionAppService,
            SurveyDefinitionAppService surveyDefinitionAppService)
        {
            _respondentsReportingAppService = respondentsReportingAppService;
            _reportPageDefinitionAppService = reportPageDefinitionAppService;
            _surveyDefinitionAppService = surveyDefinitionAppService;
        }

        [Route("aggregated-respondents")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(SurveyResultAggregatedRespondents))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage GetAggregatedRespondents(string surveyId, bool testMode)
        {
            var message = ValidateCRUDSurvey(surveyId, SurveyPermission.Read);
            if (message != null) return message;

            var result = _respondentsReportingAppService.GetSurveyResultAggregatedRespondents(surveyId,
                CurrentUserId, testMode);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        private HttpResponseMessage ValidateCRUDSurvey(string surveyId, SurveyPermission permission)
        {
            var shallowSurvey = _surveyDefinitionAppService.GetShallowSurvey(surveyId);
            if (shallowSurvey == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Survey {surveyId} not found");
            }
            if (permission == SurveyPermission.Read && !shallowSurvey.IsUserHaveReadPermission(CurrentUserId) ||
                permission == SurveyPermission.Write && !shallowSurvey.IsUserHaveWritePermission(CurrentUserId))
            {
                return Request.CreateErrorResponse(HttpStatusCode.Forbidden, string.Empty);
            }
            return null;
        }

        [Route("open-responses")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(List<string>))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage GetOpenResponses(string surveyId, string questionKey, int limit, bool testMode)
        {
            var message = ValidateCRUDSurvey(surveyId, SurveyPermission.Read);
            if (message != null) return message;

            var result = _respondentsReportingAppService.GetOpenResponses(surveyId, questionKey, limit, testMode);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [Route("settings")]
        [HttpPatch]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage UpdateSettings(string surveyId, [FromBody] ReportPageSettingsViewModel pageSettingViewModel)
        {
            var message = ValidateCRUDSurvey(surveyId, SurveyPermission.Write);
            if (message != null) return message;

            _reportPageDefinitionAppService.UpdateSettings(pageSettingViewModel);
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [Route("element-settings")]
        [HttpPut]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(HttpDataResult))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage UpdateElementSettings(string surveyId, [FromBody] ReportElementSettingsViewModel reportElementSettings)
        {
            var message = ValidateCRUDSurvey(surveyId, SurveyPermission.Write);
            if (message != null) return message;

            _reportPageDefinitionAppService.UpdateElementSettings(reportElementSettings, CurrentUserId);
            return Request.CreateResponse(HttpStatusCode.OK, HttpDataResult.Update());
        }
    }
}