using System;
using Autofac;
using Autofac.Integration.Mvc;

namespace LearningPlatform
{
    public class SingleLifetimeScopeProvider : ILifetimeScopeProvider
    {
        private readonly IContainer _container;

        public SingleLifetimeScopeProvider(IContainer container)
        {
            _container = container;
        }

        public ILifetimeScope GetLifetimeScope(Action<ContainerBuilder> configurationAction)
        {
            return _container;
        }

        public void EndLifetimeScope()
        {
            // Nothing to do since we do not create lifetime scope in GetLifetimeScope...
        }

        public ILifetimeScope ApplicationContainer { get; }
    }
}