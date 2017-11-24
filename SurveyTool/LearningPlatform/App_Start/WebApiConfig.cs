using System;
using System.Web.Http;
using System.Web.Http.Cors;
using LearningPlatform.Domain.Common;
using System.Web.Http.ExceptionHandling;
using Autofac;
using LearningPlatform.ErrorHandling;

namespace LearningPlatform
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config, IContainer container)
        {

            // Web API configuration and services
            //var cors = new EnableCorsAttribute("*", "*", "*");
            //config.EnableCors(cors);

            // Web API routes
            config.MapHttpAttributeRoutes();

            //config.Routes.MapHttpRoute("DefaultApi", "api/{controller}/{id}", new {id = RouteParameter.Optional});
            config.Formatters.XmlFormatter.SupportedMediaTypes.Clear();
            //config.DependencyResolver = new UnityDependencyResolver(UnityConfig.GetConfiguredContainer());
            config.Formatters.JsonFormatter.SerializerSettings = JsonSerializerSettingsFactory.Create( container.Resolve<IComponentContext>());

            config.Services.Replace(typeof(IExceptionHandler), new GlobalExceptionHandler());
            config.Services.Add(typeof(IExceptionLogger), new GlobalErrorLogger());

            config.EnableCors(new EnableCorsAttribute("*", "*", "GET, POST, OPTIONS, PUT, DELETE"));
        }
    }
}