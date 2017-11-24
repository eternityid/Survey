using LearningPlatform.Application.Libraries;
using LearningPlatform.Application.SurveyDesign;
using LearningPlatform.Application.SurveyDesign.Dtos;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using Swashbuckle.Swagger.Annotations;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LearningPlatform.Api.Surveys
{
    [Authorize]
    [RoutePrefix("api/surveys/{surveyId}/pages/{pageId}/questions")]
    public class QuestionDefinitionController : BaseApiController
    {
        private readonly QuestionDefinitionAppService _questionDefinitionAppService;
        private readonly LibraryQuestionAppService _libraryQuestionAppService;
        private readonly PageDefinitionAppService _pageDefinitionAppService;
        private readonly SurveyDefinitionAppService _surveyDefinitionAppService;

        public QuestionDefinitionController(QuestionDefinitionAppService questionDefinitionAppService,
            LibraryQuestionAppService libraryQuestionAppService,
            PageDefinitionAppService pageDefinitionAppService,
            SurveyDefinitionAppService surveyDefinitionAppService)
        {
            _questionDefinitionAppService = questionDefinitionAppService;
            _libraryQuestionAppService = libraryQuestionAppService;
            _pageDefinitionAppService = pageDefinitionAppService;
            _surveyDefinitionAppService = surveyDefinitionAppService;
        }

        [Route("")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(List<QuestionDefinition>))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage GetQuestions(string surveyId, string pageId)
        {
            var message = ValidateCrudSurvey(surveyId, SurveyPermission.Read);
            if (message != null) return message;

            var questions = _questionDefinitionAppService.GetAllQuestionsInPage(surveyId, pageId);
            return Request.CreateResponse(HttpStatusCode.OK, questions);
        }

        [Route("")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.Created, null, typeof(List<QuestionDefinition>))]
        [SwaggerResponse(HttpStatusCode.PreconditionFailed)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage InsertQuestion(string surveyId, string pageId, [FromBody] UpsertQuestionDto upsertQuestionDto)
        {
            var message = ValidateCrudSurvey(surveyId, SurveyPermission.Write);
            if (message != null) return message;

            var page = _pageDefinitionAppService.GetShallowPage(pageId);
            message = ValidatePageContainQuestion(page, pageId);
            if (message != null) return message;

            var result = _questionDefinitionAppService.CreateQuestion(page, upsertQuestionDto);
            return CreateCreatedResponseWithEtag(result.NewQuestion, result.PageVersion, result.SurveyVersion);
        }

        private HttpResponseMessage ValidateCrudSurvey(string surveyId, SurveyPermission permission)
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

        private HttpResponseMessage ValidatePageContainQuestion(PageDefinition page, string pageId, List<string> questionIds = null)
        {
            if (page == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Page {pageId} not found");
            }
            if (page.Version != null && !CompareWithIfMatch(page.Version))
            {
                return Request.CreateResponse(HttpStatusCode.PreconditionFailed);
            }
            if (questionIds != null)
            {
                foreach (string questionId in questionIds)
                {
                    if (!page.QuestionIds.Contains(questionId))
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, $"Question {questionId} does not belong to Page {page.Id}");
                    }
                }
            }
            return null;
        }

        [Route("duplicate")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.Created, null, typeof(List<QuestionDefinition>))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage DuplicateQuestions(string surveyId, string pageId, [FromBody] DuplicateQuestionsFromLibraryDto dto)
        {
            var message = ValidateCrudSurvey(surveyId, SurveyPermission.Write);
            if (message != null) return message;

            var page = _pageDefinitionAppService.GetShallowPage(pageId);
            message = ValidatePageContainQuestion(page, pageId);
            if (message != null) return message;

            if (dto.LibraryId == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid library id");
            }
            if (!dto.SourceQuestionIds.Any())
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid source question ids");
            }

            dto.SourceQuestionIds = dto.SourceQuestionIds.Distinct().ToList();
            var libraryQuestions = _libraryQuestionAppService.GetShallowQuestions(dto.LibraryId, dto.SourceQuestionIds);
            if (libraryQuestions.Count != dto.SourceQuestionIds.Count)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid source question ids");
            }

            var result = _questionDefinitionAppService.DuplicateQuestionsFromLibrary(page, libraryQuestions);
            return CreateCreatedResponseWithEtag(result.NewQuestions, result.PageVersion, result.SurveyVersion);
        }

        [Route("{questionId}")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(QuestionDefinition))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage GetQuestion(string surveyId, string questionId)
        {
            var message = ValidateCrudSurvey(surveyId, SurveyPermission.Write);
            if (message != null) return message;

            var question = _questionDefinitionAppService.GetFullQuestion(questionId);
            return question == null ?
                Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Question {questionId} not found") :
                CreateOkResponseWithEtag(question, question.Version);
        }

        [Route("{questionId}")]
        [HttpPut]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(QuestionDefinition))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.PreconditionFailed)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage UpdateQuestion(string surveyId, string questionId, [FromBody] UpsertQuestionDto upsertQuestionDto)
        {
            var message = ValidateCrudSurvey(surveyId, SurveyPermission.Write);
            if (message != null) return message;

            var question = _questionDefinitionAppService.GetFullQuestion(questionId);
            if (question == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Question {questionId} not found");
            }
            if (question.Version != null && !CompareWithIfMatch(question.Version))
            {
                return Request.CreateResponse(HttpStatusCode.PreconditionFailed);
            }
            var result = _questionDefinitionAppService.UpdateQuestion(question, upsertQuestionDto);
            return CreateOkResponseWithEtag(result.Question, result.Question.Version, result.SurveyEtag);
        }

        [Route("{questionId}/duplicate")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(QuestionDefinition))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.PreconditionFailed)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage Duplicate(string surveyId, string pageId, string questionId, [FromBody] DuplicateQuestionDto duplicateQuestionDto)
        {
            var message = ValidateCrudSurvey(surveyId, SurveyPermission.Write);
            if (message != null) return message;

            var page = _pageDefinitionAppService.GetShallowPage(pageId);
            message = ValidatePageContainQuestion(page, pageId, new List<string> { questionId });
            if (message != null) return message;

            var question = _questionDefinitionAppService.GetFullQuestion(questionId);
            if (question == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Question {questionId} not found");
            }
            var result = _questionDefinitionAppService.DuplicateQuestion(page, question, duplicateQuestionDto.Alias);
            return CreateCreatedResponseWithEtag(result.NewQuestion, result.PageVersion, result.SurveyVersion);
        }

        [Route("{questionId}")]
        [HttpDelete]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(QuestionDefinition))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.PreconditionFailed)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage DeleteQuestion(string surveyId, string pageId, string questionId)
        {
            var message = ValidateCrudSurvey(surveyId, SurveyPermission.Write);
            if (message != null) return message;

            var page = _pageDefinitionAppService.GetShallowPage(pageId);
            message = ValidatePageContainQuestion(page, pageId, new List<string> { questionId });
            if (message != null) return message;

            var question = _questionDefinitionAppService.GetFullQuestion(questionId);
            if (question == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Question {questionId} not found");
            }
            var result = _questionDefinitionAppService.DeletedQuestion(page, question);
            return CreateOkResponseWithEtag(result.Page, result.Page.Version, result.SurveyEtag);
        }

        [Route("{questionId}/move")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        [SwaggerResponse(HttpStatusCode.PreconditionFailed)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage MoveQuestion(string surveyId, string pageId, string questionId, [FromBody] MoveQuestionDto moveQuestionDto)
        {
            var message = ValidateCrudSurvey(surveyId, SurveyPermission.Write);
            if (message != null) return message;

            var sourcePage = _pageDefinitionAppService.GetShallowPage(pageId);
            message = ValidatePageContainQuestion(sourcePage, pageId, new List<string> { questionId });
            if (message != null) return message;

            PageDefinition destinationPage;
            if (string.Equals(sourcePage.Id, moveQuestionDto.DestinationPageId))
            {
                destinationPage = sourcePage;
            }
            else
            {
                destinationPage = _pageDefinitionAppService.GetShallowPage(moveQuestionDto.DestinationPageId);
                if (destinationPage == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Page {moveQuestionDto.DestinationPageId} not found");
                }
                if (!string.Equals(destinationPage.Version, moveQuestionDto.DestinationPageEtag))
                {
                    return Request.CreateResponse(HttpStatusCode.PreconditionFailed);
                }

            }
            var question = _questionDefinitionAppService.GetFullQuestion(questionId);
            if (question == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Question {questionId} not found");
            }
            var result = _questionDefinitionAppService.MoveQuestion(sourcePage, destinationPage, question.Id, moveQuestionDto.NewQuestionIndex);
            return CreateOkResponseWithEtag(new
            {
                DestinationPageEtag = result.DestinationPage.Version,
                DestinationPageQuestionIds = result.DestinationPage.QuestionIds
            }, result.SourcePage.Version, result.SurveyEtag);
        }
    }
}