using LearningPlatform.Domain.SurveyLayout;
using Swashbuckle.Swagger.Annotations;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;

namespace LearningPlatform.Api.LayoutsAndThemes
{
    [Authorize]
    [RoutePrefix("api/layouts")]
    public class LayoutController : ApiController
    {
        private readonly ILayoutRepository _layoutRepository;
        public LayoutController(ILayoutRepository layoutRepository)
        {
            _layoutRepository = layoutRepository;
        }

        [Route("")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(List<Layout>))]
        public List<Layout> GetAll()
        {
            return _layoutRepository.GetAll();
        }
    }
}