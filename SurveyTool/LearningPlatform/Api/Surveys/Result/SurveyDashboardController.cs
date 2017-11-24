using LearningPlatform.Application.SurveyDesign;
using LearningPlatform.Domain.SurveyDashboard;
using Swashbuckle.Swagger.Annotations;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LearningPlatform.Api.Surveys.Result
{
    [Authorize]
    [RoutePrefix("api/surveys/{surveyId}/dashboard")]
    public class SurveyDashboardController : BaseApiController
    {
        private readonly SurveyDashboardService _surveyDashboardService;
        private readonly SurveyDefinitionAppService _surveyDefinitionAppService;

        public SurveyDashboardController(SurveyDashboardService surveyDashboardService,
            SurveyDefinitionAppService surveyDefinitionAppService)
        {
            _surveyDashboardService = surveyDashboardService;
            _surveyDefinitionAppService = surveyDefinitionAppService;
        }

        [HttpGet]
        [Route("")]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(SurveyDashboard))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage GetSurveyDashboard(string surveyId, bool testMode)
        {
            var shallowSurvey = _surveyDefinitionAppService.GetShallowSurvey(surveyId);
            if (shallowSurvey == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Survey {surveyId} not found");
            }
            if (!shallowSurvey.IsUserHaveReadPermission(CurrentUserId))
            {
                return Request.CreateErrorResponse(HttpStatusCode.Forbidden, string.Empty);
            }
            var surveyDashboard = _surveyDashboardService.GetSurveyDashboard(shallowSurvey, testMode);
            return Request.CreateResponse(HttpStatusCode.OK, surveyDashboard);
        }
    }
}