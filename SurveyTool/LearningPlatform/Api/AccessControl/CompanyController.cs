using LearningPlatform.ActionFilters;
using LearningPlatform.Application.AccessControl;
using LearningPlatform.Domain.AccessControl;
using Swashbuckle.Swagger.Annotations;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LearningPlatform.Api.AccessControl
{
    [RoutePrefix("api/companies")]
    public class CompanyController : BaseApiController
    {
        private readonly CompanyAppService _companyAppService;

        public CompanyController(CompanyAppService companyAppService)
        {
            _companyAppService = companyAppService;
        }

        [CustomAuthorize(Roles = "Admin")]
        [Route("")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(List<Company>))]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage GetAll()
        {
            var companies = _companyAppService.GetAll();
            return Request.CreateResponse(HttpStatusCode.OK, companies);
        }

        [Authorize]
        [Route("{companyId}/users")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(List<User>))]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public HttpResponseMessage GetCompanyUsers(string companyId)
        {
            var company = _companyAppService.GetCompany(companyId);
            if (company == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Company {companyId} not found");
            }
            var users = _companyAppService.GetCompanyUsers(company.Id);
            return Request.CreateResponse(HttpStatusCode.OK, users);
        }
    }
}
