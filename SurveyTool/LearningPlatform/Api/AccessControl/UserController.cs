using LearningPlatform.ActionFilters;
using LearningPlatform.Application.AccessControl;
using LearningPlatform.Domain.AccessControl;
using Swashbuckle.Swagger.Annotations;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LearningPlatform.Api.AccessControl
{
    [CustomAuthorize]
    [RoutePrefix("api/users")]
    public class UserController : ApiController
    {
        private readonly UserAppService _userAppService;

        public UserController(UserAppService userAppService)
        {
            _userAppService = userAppService;
        }

        [Route("")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(List<User>))]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage GetAll()
        {
            var users = _userAppService.GetAll();
            return Request.CreateResponse(HttpStatusCode.OK, users);
        }

        [Route("{externalId}/company")]
        [HttpPut]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(User))]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public HttpResponseMessage UpsertUserCompany(string externalId, [FromBody] User modifiedUser)
        {
            var user = _userAppService.GetUserByExternalId(externalId);
            if (user == null)
            {
                //TODO confusing: UI just show company, backend inserts user info + company
                user = new User
                {
                    Id = null,
                    ExternalId = externalId,
                    FullName = modifiedUser.FullName,
                    Email = modifiedUser.Email,
                    CompanyId = modifiedUser.CompanyId,
                    RegisteredDateTime = DateTime.Now
                };
                _userAppService.InsertUser(user);
            }
            else
            {
                user.FullName = modifiedUser.FullName;
                user.Email = modifiedUser.Email;
                user.CompanyId = modifiedUser.CompanyId;
                _userAppService.UpdateUser(user);
            }

            return Request.CreateResponse(HttpStatusCode.OK, user);
        }

        [Route("{externalId}")]
        [HttpPut]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(User))]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public HttpResponseMessage Upsert(string externalId, [FromBody] User modifiedUser)
        {
            var user = _userAppService.GetUserByExternalId(externalId);
            if (user == null)
            {
                user = new User
                {
                    Id = null,
                    ExternalId = externalId,
                    FullName = modifiedUser.FullName,
                    Email = modifiedUser.Email,
                    RegisteredDateTime = DateTime.Now
                };
                _userAppService.InsertUser(user);
            }
            else
            {
                user.FullName = modifiedUser.FullName;
                user.Email = modifiedUser.Email;
                _userAppService.UpdateUser(user);
            }

            return Request.CreateResponse(HttpStatusCode.OK, user);
        }
    }
}
