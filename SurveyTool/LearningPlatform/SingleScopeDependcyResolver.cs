using Autofac;
using Autofac.Integration.WebApi;
using System;
using System.Collections.Generic;
using System.Web.Http.Dependencies;

namespace LearningPlatform
{
    public class SingleScopeDependcyResolver : IDependencyResolver
    {
        private readonly AutofacWebApiDependencyResolver _autofacWebApiDependencyResolver;
        //private readonly IContainer _container;

        public SingleScopeDependcyResolver(IContainer container)
        {
            _autofacWebApiDependencyResolver = new AutofacWebApiDependencyResolver(container);
        }

        public void Dispose()
        {
        }

        public object GetService(Type serviceType)
        {
            return _autofacWebApiDependencyResolver.GetService(serviceType);
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return _autofacWebApiDependencyResolver.GetServices(serviceType);
        }

        public IDependencyScope BeginScope()
        {
            return this;
        }
    }
}