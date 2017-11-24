using LearningPlatform.Application.Libraries;
using LearningPlatform.Application.Libraries.Dtos;
using LearningPlatform.Application.SurveyDesign;
using LearningPlatform.Application.SurveyDesign.Dtos;
using Swashbuckle.Swagger.Annotations;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LearningPlatform.Api.Libraries
{
    [Authorize]
    [RoutePrefix("api/library/pages")]
    public class LibraryPageController : BaseApiController
    {
        private readonly LibraryPageAppService _libraryPageAppService;
        private readonly PageDefinitionAppService _pageDefinitionAppService;

        public LibraryPageController(LibraryPageAppService libraryPageAppService,
            PageDefinitionAppService pageDefinitionAppService)
        {
            _libraryPageAppService = libraryPageAppService;
            _pageDefinitionAppService = pageDefinitionAppService;
        }

        [Route("")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Created)]
        public HttpResponseMessage InsertPage([FromBody] InsertLibraryPageDto dto)
        {
            var sourceShallowPage = _pageDefinitionAppService.GetShallowPage(dto.SourcePageId);
            if (sourceShallowPage == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Page {dto.SourcePageId} not found");
            }
            _libraryPageAppService.InsertPage(sourceShallowPage, CurrentUserId);
            return Request.CreateResponse(HttpStatusCode.Created);
        }

        [Route("")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(List<PageListItemDto>))]
        public HttpResponseMessage GetShallowPages()
        {
            var shallowPages = _libraryPageAppService.GetShallowPages(CurrentUserId);
            var pageListItems = shallowPages.Select(page => new PageListItemDto(page)).ToList();
            return Request.CreateResponse(HttpStatusCode.OK, pageListItems);
        }

        [Route("search")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(SearchLibraryPageResultDto))]
        public HttpResponseMessage SearchPages([FromBody] SearchLibraryPageDto dto)
        {
            var result = _libraryPageAppService.SearchPages(CurrentUserId, dto);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [Route("{pageId}/duplicate")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(LibraryPageDetailsDto))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Created)]
        public HttpResponseMessage DuplicatePage(string pageId)
        {
            var sourcePage = _libraryPageAppService.GetShallowPage(CurrentUserId, pageId);
            if (sourcePage == null) return Request.CreateResponse(HttpStatusCode.NotFound);

            var newLibraryPageDetail = _libraryPageAppService.DuplicatePage(CurrentUserId, sourcePage);
            return Request.CreateResponse(HttpStatusCode.Created, newLibraryPageDetail);
        }

        [Route("{pageId}")]
        [HttpPut]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(LibraryPageDetailsDto))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        public HttpResponseMessage UpdatePage(string pageId, [FromBody] UpdateLibraryPageDto dto)
        {
            var page = _libraryPageAppService.GetShallowPage(CurrentUserId, pageId);
            if (page == null) return Request.CreateResponse(HttpStatusCode.NotFound);
            if (string.IsNullOrWhiteSpace(dto.Title)) return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid page title");

            var libraryPageDetail = _libraryPageAppService.UpdatePage(page, dto.Title, dto.Description);
            return Request.CreateResponse(HttpStatusCode.OK, libraryPageDetail);
        }

        [Route("{pageId}")]
        [HttpDelete]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public HttpResponseMessage DeletePage(string pageId)
        {
            var page = _libraryPageAppService.GetShallowPage(CurrentUserId, pageId);
            if (page == null) return Request.CreateResponse(HttpStatusCode.NotFound);

            _libraryPageAppService.DeletePage(page);
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}
