using ApplicationInsights.OwinExtensions;
using Autofac;
using Autofac.Integration.Mvc;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.IdentityModel.Protocols;
using Microsoft.Owin;
using Microsoft.Owin.BuilderProperties;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Notifications;
using Microsoft.Owin.Security.OpenIdConnect;
using Owin;
using System.Configuration;
using System.Diagnostics;
using System.IdentityModel.Tokens;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace LearningPlatform
{
    public static class AuthConfig
    {

        public static void ConfigureAuth(IAppBuilder app)
        {
            app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

            app.Use(async (Context, next) =>
            {
                Debug.WriteLine("1 ==>request, before cookie auth");
                await next.Invoke();
                Debug.WriteLine("6 <==response, after cookie auth");
            });

            app.UseCookieAuthentication(new CookieAuthenticationOptions { AuthenticationType = CookieAuthenticationDefaults.AuthenticationType });

            app.Use(async (Context, next) =>
            {
                Debug.WriteLine("2 ==>after cookie, before OIDC");
                await next.Invoke();
                Debug.WriteLine("5 <==after OIDC");
            });

            // Configure OpenID Connect middleware for each policy
            app.UseOpenIdConnectAuthentication(CreateOptionsFromPolicy(SignInPolicyId));

            app.Use(async (Context, next) =>
            {
                Debug.WriteLine("3 ==>after OIDC, before leaving the pipeline");
                await next.Invoke();
                Debug.WriteLine("4 <==after entering the pipeline, before OIDC");
            });
        }

        // App config settings
        private static string clientId = ConfigurationManager.AppSettings["ida:ClientId"];
        private static string aadInstance = ConfigurationManager.AppSettings["ida:AadInstance"];
        private static string tenant = ConfigurationManager.AppSettings["ida:Tenant"];
        private static string redirectUri = ConfigurationManager.AppSettings["ida:RedirectUri"];

        // B2C policy identifiers
        public static string SignUpPolicyId = ConfigurationManager.AppSettings["ida:SignUpPolicyId"];
        public static string SignInPolicyId = ConfigurationManager.AppSettings["ida:SignInPolicyId"];
        public static string ProfilePolicyId = ConfigurationManager.AppSettings["ida:UserProfilePolicyId"];

        private static OpenIdConnectAuthenticationOptions CreateOptionsFromPolicy(string policy)
        {
            return new OpenIdConnectAuthenticationOptions
            {
                // For each policy, give OWIN the policy-specific metadata address, and
                // set the authentication type to the id of the policy
                MetadataAddress = string.Format(aadInstance, tenant, policy),
                AuthenticationType = policy,

                SignInAsAuthenticationType = "Cookies",
                // These are standard OpenID Connect parameters, with values pulled from web.config
                ClientId = clientId,
                RedirectUri = redirectUri,
                PostLogoutRedirectUri = redirectUri,
                Notifications = new OpenIdConnectAuthenticationNotifications
                {
                    AuthenticationFailed = AuthenticationFailed,
                },
                Scope = "openid",
                ResponseType = "id_token",

                // This piece is optional - it is used for displaying the user's name in the navigation bar.
                TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = "name",
                },
            };
        }

        private static Task AuthenticationFailed(AuthenticationFailedNotification<OpenIdConnectMessage, OpenIdConnectAuthenticationOptions> notification)
        {
            notification.HandleResponse();
            if (notification.Exception.Message == "access_denied")
            {
                notification.Response.Redirect("/");
            }
            else
            {
                notification.Response.Redirect("/Error/?message=" + notification.Exception.Message);
            }

            return Task.FromResult(0);
        }

    }
}