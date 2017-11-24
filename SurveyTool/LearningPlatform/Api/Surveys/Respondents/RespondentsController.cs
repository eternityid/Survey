using LearningPlatform.Application.Models;
using LearningPlatform.Application.Respondents;
using LearningPlatform.Application.SurveyDesign;
using LearningPlatform.Domain.Constants;
using LearningPlatform.Domain.Respondents;
using Swashbuckle.Swagger.Annotations;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace LearningPlatform.Api.Surveys.Respondents
{
    [Authorize]
    [RoutePrefix("api/surveys/{surveyId}/respondents")]
    public class RespondentsController : BaseApiController
    {
        private readonly RespondentAppService _respondentAppService;
        private readonly SurveyDefinitionAppService _surveyDefinitionAppService;

        public RespondentsController(RespondentAppService respondentAppService,
            SurveyDefinitionAppService surveyDefinitionAppService)
        {
            _respondentAppService = respondentAppService;
            _surveyDefinitionAppService = surveyDefinitionAppService;
        }

        [Route("importcontacts")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.Created)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage ImportContacts(string surveyId, bool testMode)
        {
            var message = ValidateCRUDSurvey(surveyId, SurveyPermission.Write);
            if (message != null) return message;

            var filename = HttpContext.Current.Request.Form.Get("respondentFileName");
            var uploadedFilePath = HttpContext.Current.Server.MapPath(UploadFileConstants.FolderTemp + "/" + filename);

            var error = _respondentAppService.Import(surveyId, testMode, uploadedFilePath);
            if (error != null) return Request.CreateResponse(HttpStatusCode.BadRequest, new SurveyResponseMessage(false, error));

            return Request.CreateResponse(HttpStatusCode.Created);
        }

        private HttpResponseMessage ValidateCRUDSurvey(string surveyId, SurveyPermission permission)
        {
            var shallowSurvey = _surveyDefinitionAppService.GetShallowSurvey(surveyId);
            if (shallowSurvey == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Survey {surveyId} not found");
            }

            if (permission == SurveyPermission.Write && !shallowSurvey.IsUserHaveWritePermission(CurrentUserId))
            {
                return Request.CreateErrorResponse(HttpStatusCode.Forbidden, string.Empty);
            }

            return null;
        }

        [Route("send")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.Created)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage SendEmail(string surveyId, [FromBody]SendRespondentForm form, bool testMode)
        {
            var message = ValidateCRUDSurvey(surveyId, SurveyPermission.Write);
            if (message != null) return message;

            var respondents = _respondentAppService.Search(GetFilterModel(surveyId, form.SearchModel), testMode);
            if (respondents == null || respondents.Count < 1) return Request.CreateResponse(HttpStatusCode.BadRequest);

            _respondentAppService.SendEmailToRespondents(surveyId, form.Subject, form.Content, respondents, testMode);
            return Request.CreateResponse(HttpStatusCode.Created);
        }

        [Route("launch/email")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.Created)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage SendInvitationEmail(string surveyId, [FromBody]SendEmailMessageForm form)
        {
            var message = ValidateCRUDSurvey(surveyId, SurveyPermission.Write);
            if (message != null) return message;

            _respondentAppService.SendInvitationEmailToRespondents(surveyId, form.Subject, form.Content, form.EmailAddresses, false);
            return Request.CreateResponse(HttpStatusCode.Created);
        }

        private RespondentSearchFilter GetFilterModel(string surveyId, SearchRespondentsModel filter)
        {
            return new RespondentSearchFilter
            {
                SurveyId = surveyId,
                EmailAddress = filter.Email,
                ResponseStatus = filter.Status,
                NumberSent = filter.NumberSent,
                NumberSentTo = filter.NumberSentTo,
                NumberSentOperator = filter.NumberSentOperator,
                LastTimeSent = filter.LastTimeSent,
                LastTimeSentTo = filter.LastTimeSentTo,
                LastTimeSentOperator = filter.LastTimeSentOperator
            };
        }
    }
}