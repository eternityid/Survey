using LearningPlatform.Application.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;
using LearningPlatform.Domain.SurveyExecution.Engine.RandomDataGenerator;
using Swashbuckle.Swagger.Annotations;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LearningPlatform.Api.Surveys.Responses
{
    [Authorize]
    [RoutePrefix("api/surveys/{surveyId}/responses/generate")]
    public class GenerateResponseController : BaseApiController
    {
        private readonly RandomDataGeneratorService _randomDataGeneratorService;
        private readonly SurveyDefinitionAppService _surveyDefinitionAppService;

        public GenerateResponseController(RandomDataGeneratorService randomDataGeneratorService,
            SurveyDefinitionAppService surveyDefinitionAppService)
        {
            _randomDataGeneratorService = randomDataGeneratorService;
            _surveyDefinitionAppService = surveyDefinitionAppService;
        }

        [Route("")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.Created)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage GenerateResponse(string surveyId, int iterations)
        {
            var shallowSurvey = _surveyDefinitionAppService.GetShallowSurvey(surveyId);
            if (shallowSurvey == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Survey {surveyId} not found");
            }
            if (!shallowSurvey.IsUserHaveWritePermission(CurrentUserId))
            {
                return Request.CreateErrorResponse(HttpStatusCode.Forbidden, string.Empty);
            }

            var survey = _surveyDefinitionAppService.GetFullSurvey(shallowSurvey);
            var surveyErrors = new ValidateSurveyService(survey).Validate();
            if (surveyErrors.Any())
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Can't generate testing data for an invalid survey");
            }

            //TODO: Pass random data generator settings from client and remove these settings:
            var fromDate = DateTime.Today.Subtract(TimeSpan.FromDays(30));
            var toDate = DateTime.Today;
            const int minDuration = 60;
            const int maxDuration = 600;

            _randomDataGeneratorService.Generate(surveyId, new RandomDataGeneratorSettings
            {
                RandomizeDateTimes = true,
                Iterations = iterations,
                FromDateTime = fromDate,
                ToDateTime = toDate,
                MinDuration = minDuration,
                MaxDuration = maxDuration
            });

            return Request.CreateResponse(HttpStatusCode.Created);
        }
    }
}