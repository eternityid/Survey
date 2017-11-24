using LearningPlatform.Application.SurveyDesign;
using Swashbuckle.Swagger.Annotations;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LearningPlatform.Api.Surveys.SurveyInfo
{
    //TODO: SurveyInfo should be removed
    [Authorize]
    [RoutePrefix("api/surveys/{surveyId}/surveyinfo")]
    public class SurveyInfoController : BaseApiController
    {
        private readonly SurveyDefinitionAppService _surveyDefinitionAppService;

        public SurveyInfoController(SurveyDefinitionAppService surveyDefinitionAppService)
        {
            _surveyDefinitionAppService = surveyDefinitionAppService;
        }


        //TODO: Consider to remove this, and return Survey instead (move to SurveyDefinitionController)
        [Route("")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(Domain.SurveyDesign.SurveyInfo))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage Get(string surveyId)
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

            var surveyInfo = new Domain.SurveyDesign.SurveyInfo
            {
                Name = shallowSurvey.SurveySettings.SurveyTitle,
                SurveyPublishUrl = System.Configuration.ConfigurationManager.AppSettings["SurveyUrl"] + "survey/"+ surveyId, // This is mixing the concern. Could be a client side variable.
                IsPublished = shallowSurvey.LastPublished != null,
                IsChangedAfterPublished = shallowSurvey.HasChangedAfterPublishing,
                IsInvitationOnlySurvey = shallowSurvey.SurveySettings.InvitationOnlySurvey,
                IsSingleSignOnSurvey = shallowSurvey.SurveySettings.SingleSignOnSurvey,
                SurveyStatus = shallowSurvey.Status,
                RowVersion = shallowSurvey.SurveySettings.RowVersion, // Why is surveysettings the ETAG?
                IsDeleted = shallowSurvey.IsDeleted,
                CustomColumns = shallowSurvey.CustomColumns
            };
            return Request.CreateResponse(HttpStatusCode.OK, surveyInfo);
        }
    }
}