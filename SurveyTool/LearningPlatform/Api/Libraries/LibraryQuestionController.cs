using LearningPlatform.Application.Libraries;
using LearningPlatform.Application.Libraries.Dtos;
using LearningPlatform.Application.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Questions;
using Swashbuckle.Swagger.Annotations;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LearningPlatform.Api.Libraries
{
    [Authorize]
    [RoutePrefix("api/library/questions")]
    public class LibraryQuestionController : BaseApiController
    {
        private readonly QuestionDefinitionAppService _questionDefinitionAppService;
        private readonly LibraryQuestionAppService _libraryQuestionAppService;
        private readonly LibraryAppService _libraryAppService;

        public LibraryQuestionController(QuestionDefinitionAppService questionDefinitionAppService,
            LibraryQuestionAppService libraryQuestionAppService,
            LibraryAppService libraryAppService)
        {
            _questionDefinitionAppService = questionDefinitionAppService;
            _libraryQuestionAppService = libraryQuestionAppService;
            _libraryAppService = libraryAppService;
        }

        [Route("")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Created)]
        public HttpResponseMessage InsertQuestion([FromBody] InsertLibraryQuestionDto dto)
        {
            var sourceQuestion = _questionDefinitionAppService.GetFullQuestion(dto.SourceQuestionId);
            if (sourceQuestion == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Question {dto.SourceQuestionId} not found");
            }
            _libraryQuestionAppService.InsertQuestion(sourceQuestion, CurrentUserId);
            return Request.CreateResponse(HttpStatusCode.Created);
        }

        [Route("")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(List<QuestionDefinition>))]
        public HttpResponseMessage GetShallowQuestions()
        {
            var questions = _libraryQuestionAppService.GetShallowQuestionsByUserId(CurrentUserId);
            return Request.CreateResponse(HttpStatusCode.OK, questions);
        }

        [Route("search")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(SearchLibraryQuestionResultDto))]
        public HttpResponseMessage SearchQuestions([FromBody] SearchLibraryQuestionDto dto)
        {
            var result = _libraryQuestionAppService.SearchQuestions(CurrentUserId, dto);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [Route("{questionId}/duplicate")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(QuestionDefinition))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Created)]
        public HttpResponseMessage DuplicateSurvey(string questionId)
        {
            var library = _libraryAppService.GetUserLibrary(CurrentUserId);

            var question = _libraryQuestionAppService.GetShallowQuestion(library.Id, questionId);
            if (question == null) return Request.CreateResponse(HttpStatusCode.NotFound);

            var newLibraryQuestion = _libraryQuestionAppService.DuplicateQuestion(question);
            return Request.CreateResponse(HttpStatusCode.Created, newLibraryQuestion);
        }

        [Route("{questionId}")]
        [HttpDelete]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public HttpResponseMessage DeleteQuestion(string questionId)
        {
            var library = _libraryAppService.GetUserLibrary(CurrentUserId);

            var question = _libraryQuestionAppService.GetShallowQuestion(library.Id, questionId);
            if (question == null) return Request.CreateResponse(HttpStatusCode.NotFound);

            _libraryQuestionAppService.DeleteQuestion(question);
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [Route("{questionId}")]
        [HttpPut]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(QuestionDefinition))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public HttpResponseMessage UpdateQuestion(string questionId, [FromBody] UpdateLibraryQuestionDto dto)
        {
            var library = _libraryAppService.GetUserLibrary(CurrentUserId);

            var question = _libraryQuestionAppService.GetShallowQuestion(library.Id, questionId);
            if (question == null) return Request.CreateResponse(HttpStatusCode.NotFound);

            _libraryQuestionAppService.UpdateQuestion(question, dto);
            return Request.CreateResponse(HttpStatusCode.OK, question);
        }
    }
}
