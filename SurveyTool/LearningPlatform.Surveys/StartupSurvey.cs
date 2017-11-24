using System;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Owin;
using System.IO;
using System.Threading;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using ApplicationInsights.OwinExtensions;
using Autofac;
using Autofac.Integration.Mvc;
using log4net;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Owin.BuilderProperties;

[assembly: OwinStartupAttribute(typeof(LearningPlatform.StartupSurvey))]
[assembly: log4net.Config.XmlConfigurator(ConfigFile = "Web.config", Watch = true)]
namespace LearningPlatform
{
    public class StartupSurvey
    {
        private IContainer _container;

        public void Configuration(IAppBuilder app)
        {
            try
            {
                app.UseApplicationInsights();

                _container = AutofacConfig.Configure().Build();
                DependencyResolver.SetResolver(
                    new AutofacDependencyResolver(_container, new SingleLifetimeScopeProvider(_container)));

                // Cors is required for question preview/look and feel preview.
                app.UseCors(CorsOptions.AllowAll);

                AuthConfig.ConfigureAuth(app);

                AreaRegistration.RegisterAllAreas();
                FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
                RouteConfig.RegisterRoutes(RouteTable.Routes);
                BundleConfig.RegisterBundles(BundleTable.Bundles);
                AutoMapperConfig.Configure();

                log4net.Config.XmlConfigurator.Configure(new FileInfo("Web.config"));

                var properties = new AppProperties(app.Properties);
                CancellationToken token = properties.OnAppDisposing;
                if (token != CancellationToken.None)
                {
                    token.Register(OnShutdown);
                }
            }
            catch (Exception exception)
            {
                ILog logger = LogManager.GetLogger("ErrorHandler");
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