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
    [Authorize]
    [RoutePrefix("api/user")]
    public class PersonalUserController : BaseApiController
    {
        private readonly UserAppService _userAppService;
        private readonly CompanyAppService _companyAppService;

        public PersonalUserController(UserAppService userAppService,
            CompanyAppService companyAppService)
        {
            _userAppService = userAppService;
            _companyAppService = companyAppService;
        }

        [Route("")]
        [HttpPut]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(User))]
        public HttpResponseMessage Upsert()
        {
            var currentDateTime = DateTime.Now;

            var user = _userAppService.GetUserByExternalId(CurrentUserId);
            if (user == null)
            {
                user = new User
                {
                    Id = null,
                    ExternalId = CurrentUserId,
                    Email = CurrentUserEmail,
                    FullName = CurrentUserFullName,
                    LoginCount = 1,
                    LastLoginDateTime = currentDateTime,
                    RegisteredDateTime = currentDateTime
                };
                _userAppService.InsertUser(user);
            }
            else
            {
                user.Email = CurrentUserEmail;
                user.FullName = CurrentUserFullName;
                user.LoginCount++;
                user.LastLoginDateTime = currentDateTime;
                _userAppService.UpdateUser(user);
            }
            return Request.CreateResponse(HttpStatusCode.OK, user);
        }

        [Route("co-workers")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(List<User>))]
        public HttpResponseMessage GetCoworkers()
        {
            var user = _userAppService.GetUserByExternalId(CurrentUserId);
            if (user?.CompanyId == null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, new List<User>());
            }

            var coworkers = _companyAppService.GetCompanyUsers(user.CompanyId);
            coworkers.RemoveAll(p => p.ExternalId == user.ExternalId);
            return Request.CreateResponse(HttpStatusCode.OK, coworkers);
        }

        [Route("")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(User))]
        public HttpResponseMessage GetPersonalUser()
        {
            var user = _userAppService.GetUserByExternalId(CurrentUserId);
            return Request.CreateResponse(HttpStatusCode.OK, user);
        }
    }
}
