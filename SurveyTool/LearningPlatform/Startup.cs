using ApplicationInsights.OwinExtensions;
using Autofac;
using Autofac.Integration.WebApi;
using IdentityServer3.AccessTokenValidation;
using LearningPlatform.ActionFilters;
using LearningPlatform.Data.EntityFramework.ResponsesDb;
using LearningPlatform.Domain.Common;
using LearningPlatform.ErrorHandling;
using log4net;
using Microsoft.Owin;
using Microsoft.Owin.BuilderProperties;
using Owin;
using System;
using System.Configuration;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Threading;
using System.Web.Http;

[assembly: OwinStartupAttribute(typeof(LearningPlatform.Startup))]
namespace LearningPlatform
{
    public class Startup
    {
        private IContainer _container;

        public void Configuration(IAppBuilder app)
        {
            try
            {
                app.UseApplicationInsights();
                var builder = AutofacConfig.Configure();
                _container = builder.Build();
                AutoMapperConfig.Configure();
                new ResponsesContext().Respondents.Any(r => r.Id == 1);
                new TestResponsesContext().Respondents.Any(r => r.Id == 1);

                log4net.Config.XmlConfigurator.Configure();
                app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
                app.UseIdentityServerBearerTokenAuthentication(new IdentityServerBearerTokenAuthenticationOptions
                {
                    Authority = ConfigurationManager.AppSettings["AuthorityUrl"],
                    RequiredScopes = new[] {"surveyInternalApi"},
                    RoleClaimType = ClaimTypes.Role
                });

                var config = new HttpConfiguration();
                builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
                config.DependencyResolver = new SingleScopeDependcyResolver(_container);
                config.Filters.Add(_container.Resolve<SaveChangesActionFilter>());

                SwaggerConfig.Register(config);
                WebApiConfig.Register(config, _container);
                app.UseWebApi(config);
                var properties = new AppProperties(app.Properties);

                var token = properties.OnAppDisposing;
                if (token != CancellationToken.None)
                {
                    token.Register(OnShutdown);
                }

                var dataSeeder = _container.Resolve<IDataSeeder>();
                dataSeeder.Seed(_container);
            }
            catch (Exception exception)
            {
                var logger = LogManager.GetLogger(typeof(GlobalErrorLogger));
                logger.Error("", exception);
                throw;
            }

        }

        private void OnShutdown()
        {
            _container.Dispose();
        }

    }
}