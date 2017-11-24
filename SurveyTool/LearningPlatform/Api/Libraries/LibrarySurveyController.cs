using LearningPlatform.Application.Libraries;
using LearningPlatform.Application.Libraries.Dtos;
using LearningPlatform.Application.SurveyDesign;
using LearningPlatform.Application.SurveyDesign.Dtos;
using Swashbuckle.Swagger.Annotations;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LearningPlatform.Api.Libraries
{
    [Authorize]
    [RoutePrefix("api/library/surveys")]
    public class LibrarySurveyController : BaseApiController
    {
        private readonly SurveyDefinitionAppService _surveyDefinitionAppService;
        private readonly LibrarySurveyAppService _librarySurveyAppService;
        private readonly LibraryAppService _libraryAppService;

        public LibrarySurveyController(SurveyDefinitionAppService surveyDefinitionAppService,
            LibrarySurveyAppService librarySurveyAppService,
            LibraryAppService libraryAppService)
        {
            _surveyDefinitionAppService = surveyDefinitionAppService;
            _librarySurveyAppService = librarySurveyAppService;
            _libraryAppService = libraryAppService;
        }

        [Route("")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Created)]
        public HttpResponseMessage InsertSurvey([FromBody] InsertLibrarySurveyDto dto)
        {
            var survey = _surveyDefinitionAppService.GetShallowSurvey(dto.SourceSurveyId);
            if (survey == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Survey {dto.SourceSurveyId} not found");
            }
            if (!survey.IsUserHaveWritePermission(CurrentUserId))
            {
                return Request.CreateErrorResponse(HttpStatusCode.Forbidden, string.Empty);
            }
            _librarySurveyAppService.InsertSurvey(survey, CurrentUserId);
            return Request.CreateResponse(HttpStatusCode.Created);
        }

        [Route("")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(List<SurveyListItemDto>))]
        public HttpResponseMessage GetSurveyTitles()
        {
            var surveyTitles = _librarySurveyAppService.GetSurveyTitles(CurrentUserId);
            return Request.CreateResponse(HttpStatusCode.OK, surveyTitles);
        }

        [Route("search")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(SearchLibrarySurveyResultDto))]
        public HttpResponseMessage SearchSurveys([FromBody] SearchLibrarySurveyDto dto)
        {
            var result = _librarySurveyAppService.SearchSurveys(CurrentUserId, dto);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [Route("{surveyId}/duplicate")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(LibrarySurveyDetailsDto))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Created)]
        public HttpResponseMessage DuplicateSurvey(string surveyId)
        {
            var library = _libraryAppService.GetUserLibrary(CurrentUserId);

            var sourceSurvey = _librarySurveyAppService.GetShallowSurvey(library.Id, surveyId);
            if (sourceSurvey == null) return Request.CreateResponse(HttpStatusCode.NotFound);

            var newLibrarySurveyDetails = _librarySurveyAppService.DuplicateSurvey(CurrentUserId, sourceSurvey);
            return Request.CreateResponse(HttpStatusCode.Created, newLibrarySurveyDetails);
        }

        [Route("{surveyId}")]
        [HttpPut]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(LibrarySurveyDetailsDto))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        public HttpResponseMessage UpdateSurvey(string surveyId, [FromBody] UpdateLibrarySurveyDto dto)
        {
            var library = _libraryAppService.GetUserLibrary(CurrentUserId);

            var survey = _librarySurveyAppService.GetShallowSurvey(library.Id, surveyId);
            if (survey == null) return Request.CreateResponse(HttpStatusCode.NotFound);
            if(string.IsNullOrWhiteSpace(dto.Title)) return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid survey title");

            var librarySurveyDetails = _librarySurveyAppService.UpdateSurvey(survey, dto.Title);
            return Request.CreateResponse(HttpStatusCode.OK, librarySurveyDetails);
        }

        [Route("{surveyId}")]
        [HttpDelete]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public HttpResponseMessage DeleteSurvey(string surveyId)
        {
            var library = _libraryAppService.GetUserLibrary(CurrentUserId);

            var survey = _librarySurveyAppService.GetShallowSurvey(library.Id, surveyId);
            if (survey == null) return Request.CreateResponse(HttpStatusCode.NotFound);

            _librarySurveyAppService.DeleteSurvey(survey);
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}
