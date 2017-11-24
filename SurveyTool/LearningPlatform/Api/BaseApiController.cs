using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Web.Http;

namespace LearningPlatform.Api
{
    public class BaseApiController : ApiController
    {
        protected enum SurveyPermission //TODO Where to move to
        {
            Read,
            Write,
            Full
        }

        protected string CurrentUserId
        {
            get
            {
                var principal = ClaimsPrincipal.Current;
                var idClaim = principal.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
                if (idClaim == null) throw new InvalidOperationException("Current user not found");
                return idClaim.Value;
            }
        }

        protected string CurrentUserEmail
        {
            get
            {
                var principal = ClaimsPrincipal.Current;
                var emailClaim = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
                return emailClaim?.Value;
            }
        }

        protected string CurrentUserFullName
        {
            get
            {
                var principal = ClaimsPrincipal.Current;
                var firstNameClaim = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.GivenName);
                var lastNameClaim = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Surname);

                var fullNameParts = new List<string>();
                if (!string.IsNullOrWhiteSpace(firstNameClaim?.Value))
                {
                    fullNameParts.Add(firstNameClaim.Value);
                }
                if (!string.IsNullOrWhiteSpace(lastNameClaim?.Value))
                {
                    fullNameParts.Add(lastNameClaim.Value);
                }
                return string.Join(" ", fullNameParts);
            }
        }

        protected string SurveyETag
        {
            get
            {
                IEnumerable<string> values;
                return Request.Headers.TryGetValues("Survey-ETag", out values) ? values.FirstOrDefault() : null;
            }
        }

        protected bool CompareWithIfMatch(string entityVersion)
        {
            IEnumerable<string> ifMatchValues;
            var ifMatch = Request.Headers.TryGetValues("If-Match", out ifMatchValues) ? ifMatchValues.FirstOrDefault() : null;
            return string.Equals(entityVersion, ifMatch);
        }

        protected bool CompareWithIfNoneMatch(string entityVersion)
        {
            IEnumerable<string> ifNoneMatchValues;
            var ifNoneMatch = Request.Headers.TryGetValues("If-None-Match", out ifNoneMatchValues) ? ifNoneMatchValues.FirstOrDefault() : null;
            return string.Equals(entityVersion, ifNoneMatch);
        }

        protected HttpResponseMessage CreateCreatedResponseWithEtag(object entity, string entityVersion, string surveyVersion = null)
        {
            var response = entity == null ?
                Request.CreateResponse(HttpStatusCode.Created) :
                Request.CreateResponse(HttpStatusCode.Created, entity);
            if (entityVersion != null)
            {
                response.Headers.TryAddWithoutValidation("ETag", entityVersion);
            }
            if (surveyVersion != null)
            {
                response.Headers.TryAddWithoutValidation("Survey-ETag", surveyVersion);
            }
            return response;
        }

        protected HttpResponseMessage CreateOkResponseWithEtag(object entity, string entityVersion, string surveyVersion = null)
        {
            var response = entity == null ?
                Request.CreateResponse(HttpStatusCode.OK) :
                Request.CreateResponse(HttpStatusCode.OK, entity);
            if (entityVersion != null)
            {
                response.Headers.TryAddWithoutValidation("ETag", entityVersion);
            }
            if (surveyVersion != null)
            {
                response.Headers.TryAddWithoutValidation("Survey-ETag", surveyVersion);
            }
            return response;
        }

        protected HttpResponseMessage CreateOkResponseWithCaching<T>(T entity, string entityVersion)
        {
            var response = Request.CreateResponse(HttpStatusCode.OK, entity);
            response.Headers.CacheControl = new CacheControlHeaderValue
            {
                Private = true,
                MaxAge = TimeSpan.FromSeconds(0)
            };
            if (entityVersion != null)
            {
                response.Headers.TryAddWithoutValidation("ETag", entityVersion);
            }
            return response;
        }

        protected HttpResponseMessage CreateEmptyResponseWithCaching(string entityVersion)
        {
            var response = Request.CreateResponse(HttpStatusCode.NotModified);
            response.Headers.CacheControl = new CacheControlHeaderValue
            {
                Private = true,
                MaxAge = TimeSpan.FromSeconds(0)
            };
            if (entityVersion != null)
            {
                response.Headers.TryAddWithoutValidation("ETag", entityVersion);
            }
            return response;
        }
    }
}