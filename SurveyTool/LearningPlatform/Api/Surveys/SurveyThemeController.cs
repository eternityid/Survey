using LearningPlatform.Application.SurveyDesign;
using LearningPlatform.Application.SurveyDesign.Dtos;
using LearningPlatform.Domain.SurveyDesign.Services.Libraries;
using Swashbuckle.Swagger.Annotations;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LearningPlatform.Api.Surveys
{
    [Authorize]
    [RoutePrefix("api/surveys/{surveyId}/lookandfeel")]
    public class SurveyThemeController : BaseApiController
    {
        private readonly LookAndFeelAppService _lookAndFeelAppService;
        private readonly SurveyDefinitionAppService _surveyDefinitionAppService;
        private readonly ReadLibraryService _readLibraryService;

        public SurveyThemeController(LookAndFeelAppService lookAndFeelAppService,
            SurveyDefinitionAppService surveyDefinitionAppService,
            ReadLibraryService readLibraryService)
        {
            _lookAndFeelAppService = lookAndFeelAppService;
            _surveyDefinitionAppService = surveyDefinitionAppService;
            _readLibraryService = readLibraryService;
        }

        [Route("")]
        [HttpPut]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage Put([FromBody] UpsertThemeDto dto)
        {
            var libraryId = _readLibraryService.GetDefaultLibraryByUserId(CurrentUserId).Id;
            var shallowSurvey =_surveyDefinitionAppService.GetShallowSurvey(dto.SurveyId);
            if (shallowSurvey == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Survey {dto.SurveyId} not found");
            }
            if (!shallowSurvey.IsUserHaveWritePermission(CurrentUserId))
            {
                return Request.CreateErrorResponse(HttpStatusCode.Forbidden, string.Empty);
            }

            _lookAndFeelAppService.UpdateLookAndFeel(dto, shallowSurvey, CurrentUserId, libraryId);
            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                SurveyId = dto.SurveyId,
                ThemeId = dto.Theme.Id
            });
        }
    }
}