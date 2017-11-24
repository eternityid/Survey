using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyThemes;
using Swashbuckle.Swagger.Annotations;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LearningPlatform.Api.LayoutsAndThemes
{
    [Authorize]
    [RoutePrefix("api/themes")]
    public class ThemeController : BaseApiController
    {
        private readonly IThemeRepository _themeRepository;

        public ThemeController(IThemeRepository themeRepository)
        {
            _themeRepository = themeRepository;
        }

        [Route("{themeId}")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(Theme))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public HttpResponseMessage Get(string themeId)
        {
            var theme = _themeRepository.GetById(themeId);
            return theme == null ?
                Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Theme {themeId} not found") :
                Request.CreateResponse(HttpStatusCode.OK, theme);
        }

        [Route("")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(List<Theme>))]
        public List<Theme> GetAll()
        {
            return _themeRepository.GetAll().ToList();
        }

        [Route("types/system")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(List<Theme>))]
        public List<Theme> GetSystemThemes()
        {
            return _themeRepository.GetByType(ThemeType.System).ToList();
        }

        [Route("types/system-user")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(List<Theme>))]
        public List<Theme> GetSystemUserThemes()
        {
            return _themeRepository.GetSystemAndUserThemesByUserId(CurrentUserId);
        }
    }
}