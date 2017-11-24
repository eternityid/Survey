using LearningPlatform.Application.SurveyDesign;
using LearningPlatform.Application.SurveyDesign.Dtos;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Pages;
using Swashbuckle.Swagger.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LearningPlatform.Api.Surveys
{
    [Authorize]
    [RoutePrefix("api/surveys/{surveyId}/folders/{folderId}/pages")]
    public class PageDefinitionController : BaseApiController
    {
        private readonly SurveyDefinitionAppService _surveyDefinitionAppService;
        private readonly PageDefinitionAppService _pageDefinitionAppService;
        private readonly FolderDefinitionAppService _folderDefinitionAppService;

        public PageDefinitionController(SurveyDefinitionAppService surveyDefinitionAppService,
            PageDefinitionAppService pageDefinitionAppService,
            FolderDefinitionAppService folderDefinitionAppService)
        {
            _surveyDefinitionAppService = surveyDefinitionAppService;
            _pageDefinitionAppService = pageDefinitionAppService;
            _folderDefinitionAppService = folderDefinitionAppService;
        }

        [Route("")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.Created, null, typeof(PageDefinition))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage Post(string surveyId, string folderId, [FromBody] InsertPageDto model)
        {
            var message = ValidateCUDSurvey(surveyId);
            if (message != null) return message;

            var folder = _folderDefinitionAppService.GetShallowFolder(folderId);
            message = ValidateFolderContainPage(folder, folderId);
            if (message != null) return message;

            var result = _pageDefinitionAppService.CreatePage(folder, model.PageIndex, model.PageTitle);
            return CreateCreatedResponseWithEtag(result.NewPage, result.FolderVersion, result.SurveyVersion);
        }

        private HttpResponseMessage ValidateCUDSurvey(string surveyId)
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
            return null;
        }

        private HttpResponseMessage ValidateFolderContainPage(Folder folder, string folderId, List<string> pageIds = null)
        {
            if (folder == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Folder {folderId} not found");
            }
            if (folder.Version != null && !CompareWithIfMatch(folder.Version))
            {
                return Request.CreateResponse(HttpStatusCode.PreconditionFailed);
            }
            if (pageIds != null)
            {
                foreach(string pageId in pageIds) {
                    if (!folder.ChildIds.Contains(pageId))
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                            $"Page {pageId} does not belong to Folder {folder.Id}");
                    }
                }
            }
            return null;
        }

        [Route("duplicate")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.Created, null, typeof(List<PageDefinition>))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage DuplicatePages(string surveyId, string folderId, [FromBody] DuplicatePagesDto dto)
        {
            var message = ValidateCUDSurvey(surveyId);
            if (message != null) return message;

            var folder = _folderDefinitionAppService.GetShallowFolder(folderId);
            message = ValidateFolderContainPage(folder, folderId);
            if (message != null) return message;

            if (dto.LibraryId == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid library");
            }
            if (dto.DuplicatePoint < 0 || dto.DuplicatePoint >= folder.ChildIds.Count)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid duplicate point");
            }
            if (!dto.SourcePageIds.Any())
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid source page ids");
            }

            dto.SourcePageIds = dto.SourcePageIds.Distinct().ToList();
            var sourcePages = _pageDefinitionAppService.GetLibraryShallowPages(dto.LibraryId, dto.SourcePageIds);
            var sourcePageIds = sourcePages.Select(p => p.Id).ToList();
            if (dto.SourcePageIds.Count != sourcePageIds.Count || dto.SourcePageIds.Except(sourcePageIds).Any())
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid source page ids");
            }

            var result = _pageDefinitionAppService.DuplicatePages(folder, sourcePages, dto.DuplicatePoint);
            return CreateCreatedResponseWithEtag(result.NewPages, result.FolderVersion, result.SurveyVersion);
        }

        [Route("{pageId}")]
        [HttpDelete]
        [SwaggerResponse(HttpStatusCode.OK, null)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage Delete(string surveyId, string folderId, string pageId)
        {
            var message = ValidateCUDSurvey(surveyId);
            if (message != null) return message;

            var folder = _folderDefinitionAppService.GetShallowFolder(folderId);
            message = ValidateFolderContainPage(folder, folderId, new List<string> { pageId });
            if (message != null) return message;

            var page = _pageDefinitionAppService.GetPage(pageId);
            if (page == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Page {pageId} not found");
            }
            var result = _pageDefinitionAppService.DeletePage(folder, page);
            return CreateOkResponseWithEtag(null, folder.Version, result.SurveyEtag);
        }

        [Route("{pageId}")]
        [HttpPut]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(PageDefinition))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage Put(string surveyId, string folderId, string pageId, [FromBody] PageAndThemeDto pageAndTheme)
        {
            var message = ValidateCUDSurvey(surveyId);
            if (message != null) return message;

            var page = _pageDefinitionAppService.GetPage(pageId);
            if (page == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Page {pageId} not found");
            }
            if (page.Version != null && !CompareWithIfMatch(page.Version))
            {
                return Request.CreateResponse(HttpStatusCode.PreconditionFailed);
            }
            var result = _pageDefinitionAppService.UpdatePage(page, pageAndTheme, CurrentUserId);
            return CreateOkResponseWithEtag(result.Page, result.Page.Version, result.SurveyEtag);
        }

        [Route("{pageId}/skipcommands")]
        [HttpPut]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(PageDefinition))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage UpdateSkipCommands(string surveyId, string folderId, string pageId,
            [FromBody] PageDefinition modifiedPage)
        {
            var message = ValidateCUDSurvey(surveyId);
            if (message != null) return message;

            var page = _pageDefinitionAppService.GetPage(pageId);
            if (page == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Page {pageId} not found");
            }
            if (page.Version != null && !CompareWithIfMatch(page.Version))
            {
                return Request.CreateResponse(HttpStatusCode.PreconditionFailed);
            }
            var result = _pageDefinitionAppService.UpdateSkipCommands(page, modifiedPage.SkipCommands);
            return CreateOkResponseWithEtag(result.Page, result.Page.Version, result.SurveyEtag);
        }

        [Route("{pageId}/move")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage MovePage(string surveyId, string folderId, string pageId, [FromBody]MovePageDto movePageDto)
        {
            var message = ValidateCUDSurvey(surveyId);
            if (message != null) return message;

            var folder = _folderDefinitionAppService.GetShallowFolder(folderId);
            message = ValidateFolderContainPage(folder, folderId, new List<string> { pageId });
            if (message != null) return message;

            var result = _pageDefinitionAppService.MovePage(folder, pageId, movePageDto.NewPageIndex);
            return CreateOkResponseWithEtag(new
            {
                FolderId = folder.Id,
                ChildIds = folder.ChildIds
            }, folder.Version, result.SurveyEtag);
        }

        [Route("{pageId}/split")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(SplitPageResultDto))]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        [SwaggerResponse(HttpStatusCode.PreconditionFailed)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public HttpResponseMessage Split(string surveyId, string folderId, string pageId, [FromBody] SplitPageDto dto)
        {
            var message = ValidateCUDSurvey(surveyId);
            if (message != null) return message;

            var folder = _folderDefinitionAppService.GetShallowFolder(folderId);
            message = ValidateFolderContainPage(folder, folderId, new List<string> { pageId });
            if (message != null) return message;

            var page = _pageDefinitionAppService.GetPage(pageId);
            if (page == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Page {pageId} not found");
            }
            if (page.Version != null && page.Version != dto.PageEtag)
            {
                return Request.CreateResponse(HttpStatusCode.PreconditionFailed);
            }
            var result = _pageDefinitionAppService.SplitPage(folder, page, dto.SplitPoint, dto.PageTitle);
            return CreateOkResponseWithEtag(result, result.FolderVersion, result.SurveyVersion);
        }

        [Route("{pageId}/merge")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(PageDefinition))]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        [SwaggerResponse(HttpStatusCode.PreconditionFailed)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public HttpResponseMessage MergePage(string surveyId, string folderId, string pageId, [FromBody] MergeTwoPagesDto dto)
        {
            var message = ValidateCUDSurvey(surveyId);
            if (message != null) return message;

            var folder = _folderDefinitionAppService.GetShallowFolder(folderId);
            message = ValidateFolderContainPage(folder, folderId, new List<string> { pageId, dto.SecondPageId });
            if (message != null) return message;

            var firstPage = _pageDefinitionAppService.GetPage(pageId);
            if (firstPage == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Page {pageId} not found");
            }
            if (firstPage.Version != null && firstPage.Version != dto.FirstPageEtag)
            {
                return Request.CreateResponse(HttpStatusCode.PreconditionFailed);
            }
            var secondPage = _pageDefinitionAppService.GetPage(dto.SecondPageId);
            if (secondPage == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Page {dto.SecondPageId} not found");
            }
            if (secondPage.Version != null && secondPage.Version != dto.SecondPageEtag)
            {
                return Request.CreateResponse(HttpStatusCode.PreconditionFailed);
            }
            var result = _pageDefinitionAppService.MergePages(folder, firstPage, secondPage);
            return CreateOkResponseWithEtag(result.NewPage, result.FolderVersion, result.SurveyVersion);
        }
    }
}
