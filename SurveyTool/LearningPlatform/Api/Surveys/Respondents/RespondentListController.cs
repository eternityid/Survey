using LearningPlatform.Application.Models;
using LearningPlatform.Application.Respondents;
using LearningPlatform.Application.SurveyDesign;
using LearningPlatform.Domain.Respondents;
using LearningPlatform.Result;
using Swashbuckle.Swagger.Annotations;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LearningPlatform.Api.Surveys.Respondents
{
    [Authorize]
    [RoutePrefix("api/surveys/{surveyId}/respondents")]
    public class RespondentListController : BaseApiController
    {
        private readonly RespondentAppService _respondentAppService;
        private readonly SurveyDefinitionAppService _surveyDefinitionAppService;

        public RespondentListController(RespondentAppService respondentAppService,
            SurveyDefinitionAppService surveyDefinitionAppService)
        {
            _respondentAppService = respondentAppService;
            _surveyDefinitionAppService = surveyDefinitionAppService;
        }

        [Route("search")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(RespondentSearchResultModel))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage Search(string surveyId, [FromBody] SearchRespondentsModel searchModel, bool testMode)
        {
            var message = ValidateCRUDSurvey(surveyId, SurveyPermission.Read);
            if (message != null) return message;

            var paging = searchModel.Paging;
            var filterCondition = new RespondentSearchFilter
            {
                SurveyId = surveyId,
                EmailAddress = searchModel.Email,
                ResponseStatus = searchModel.Status,
                NumberSent = searchModel.NumberSent,
                NumberSentTo = searchModel.NumberSentTo,
                NumberSentOperator = searchModel.NumberSentOperator,
                LastTimeSent = searchModel.LastTimeSent,
                LastTimeSentTo = searchModel.LastTimeSentTo,
                LastTimeSentOperator = searchModel.LastTimeSentOperator,
                CompletedTimeSent = searchModel.CompletedTimeSent,
                CompletedTimeSentTo = searchModel.CompletedTimeSentTo,
                CompletedTimeSentOperator = searchModel.CompletedTimeSentOperator
            };

            return Request.CreateResponse(HttpStatusCode.OK, new RespondentSearchResultModel
            {
                Respondents = _respondentAppService.Search(filterCondition, paging.startInt, paging.limitInt, testMode),
                TotalRespondentsFound = _respondentAppService.Count(filterCondition, testMode)
            });
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

        [Route("{respondentId}/detail")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(RespondentDetail))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage GetRespondentDetail(string surveyId, long respondentId, bool testMode)
        {
            var message = ValidateCRUDSurvey(surveyId, SurveyPermission.Read);
            if (message != null) return message;

            var respondentDetail =_respondentAppService.GetRespondentDetail(surveyId, respondentId, testMode);
            if (respondentDetail == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Respondent {respondentId} not found");
            }

            return Request.CreateResponse(HttpStatusCode.OK, respondentDetail);
        }

        [Route("")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.Created, null, typeof(HttpDataResult))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage AddRespondents(string surveyId, IList<string> respondentEmails, bool testMode)
        {
            var message = ValidateCRUDSurvey(surveyId, SurveyPermission.Write);
            if (message != null) return message;

            _respondentAppService.AddRespondents(surveyId, respondentEmails, testMode);
            return Request.CreateResponse(HttpStatusCode.Created, HttpDataResult.Create());
        }

        [Route("delete")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(HttpDataResult))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage DeleteRespondents(string surveyId, IList<long> respondentIds, bool testMode)
        {
            var message = ValidateCRUDSurvey(surveyId, SurveyPermission.Write);
            if (message != null) return message;

            _respondentAppService.DeleteRespondents(surveyId, respondentIds, testMode);
            return Request.CreateResponse(HttpStatusCode.OK, HttpDataResult.Update());
        }
    }
}