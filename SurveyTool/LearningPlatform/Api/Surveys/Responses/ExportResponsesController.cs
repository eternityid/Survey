using LearningPlatform.Application.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.ExportResponses;
using Swashbuckle.Swagger.Annotations;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace LearningPlatform.Api.Surveys.Responses
{
    [Authorize]
    [RoutePrefix("api/surveys/{surveyId}/responses")]
    public class ExportResponsesController : BaseApiController
    {
        private readonly ExportResponsesService _exportResponsesService;
        private readonly SurveyDefinitionAppService _surveyDefinitionAppService;

        public ExportResponsesController(ExportResponsesService exportResponsesService,
            SurveyDefinitionAppService surveyDefinitionAppService)
        {
            _exportResponsesService = exportResponsesService;
            _surveyDefinitionAppService = surveyDefinitionAppService;
        }

        [HttpPost]
        [Route("export")]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(StringContent))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage ExportResponsesData(string surveyId, [FromBody] ExportResponsesSettings settings, bool testMode)
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

            var responsesDataAsString = _exportResponsesService.ExportResponsesData(surveyId, settings, testMode);

            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(responsesDataAsString)
            };
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");

            return result;
        }
    }
}