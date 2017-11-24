using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace LearningPlatform.ActionFilters
{
    public class CustomAuthorizeAttribute : AuthorizeAttribute
    {
        protected override void HandleUnauthorizedRequest(HttpActionContext context)
        {
            if (!context.RequestContext.Principal.Identity.IsAuthenticated)
                base.HandleUnauthorizedRequest(context);
            else
            {
                context.Response = new HttpResponseMessage(HttpStatusCode.Forbidden);
            }
        }
    }
}