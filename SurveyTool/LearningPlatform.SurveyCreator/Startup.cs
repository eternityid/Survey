using System;
using System.Collections.Generic;
using System.Configuration;
using System.IdentityModel.Tokens;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Protocols;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Notifications;
using Microsoft.Owin.Security.OpenIdConnect;
using Owin;
using Constants = IdentityServer3.Core.Constants;

#pragma warning disable 1998

namespace LearningPlatform.SurveyCreator
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            string applicationUrl = ConfigurationManager.AppSettings["ClientAppUrl"] + "#/login/";
            string authorityUrl = ConfigurationManager.AppSettings["AuthorityUrl"];
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = "Cookies",
                CookieName = "surveyFileAccess",
            });
            app.UseOpenIdConnectAuthentication(new OpenIdConnectAuthenticationOptions
            {
                Authority = authorityUrl,
                ClientId = "ResponsiveInsight",
                Scope = "openid profile",
                RedirectUri = applicationUrl,
                ResponseType = "id_token",

                SignInAsAuthenticationType = "Cookies",
                UseTokenLifetime = false,

                Notifications = new OpenIdConnectAuthenticationNotifications
                {
                    RedirectToIdentityProvider = RedirectToIdentityProvider(),
                    SecurityTokenValidated = SecurityTokenValidated()
                }
            });

            app.Use(async (context, next) =>
            {
                if (!IsAuthenicated(context.Authentication.User))
                {
                    if (context.Request.Headers["accept"].Contains(@"text/html"))
                    {
                        context.Authentication.Challenge();
                        return;
                    }
                    context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                }
                await next();
            });
            JwtSecurityTokenHandler.InboundClaimTypeMap = new Dictionary<string, string>();
        }

        private static bool IsAuthenicated(ClaimsPrincipal user)
        {
            return user != null && user.Identity != null && user.Identity.IsAuthenticated;
        }

        private static Func<SecurityTokenValidatedNotification<OpenIdConnectMessage, OpenIdConnectAuthenticationOptions>, Task> SecurityTokenValidated()
        {
            return async validatedNotification =>
            {
                var fromIdentity = validatedNotification.AuthenticationTicket.Identity;
                var toIdentity = new ClaimsIdentity(fromIdentity.AuthenticationType,
                    Constants.ClaimTypes.GivenName, Constants.ClaimTypes.Role);
                toIdentity.AddClaim(new Claim(Constants.TokenTypes.IdentityToken, validatedNotification.ProtocolMessage.IdToken));
                validatedNotification.AuthenticationTicket = new AuthenticationTicket(toIdentity,
                    validatedNotification.AuthenticationTicket.Properties);
            };
        }

        private static Func<RedirectToIdentityProviderNotification<OpenIdConnectMessage, OpenIdConnectAuthenticationOptions>, Task> RedirectToIdentityProvider()
        {
            return async n =>
            {
                if (n.ProtocolMessage.RequestType == OpenIdConnectRequestType.LogoutRequest)
                {
                    try
                    {
                        var idTokenHint = n.OwinContext.Authentication.User.FindFirst("id_token").Value;
                        n.ProtocolMessage.IdTokenHint = idTokenHint;
                    }
                    catch
                    {
                        // ignored
                    }
                }

            };
        }
    }
}
#pragma warning restore 1998
