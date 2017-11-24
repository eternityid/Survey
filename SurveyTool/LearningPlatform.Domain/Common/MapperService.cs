using Autofac;
using AutoMapper;

namespace LearningPlatform.Domain.Common
{
    public class MapperService
    {
        private readonly IComponentContext _componentContext;
        public MapperService(IComponentContext componentContext)
        {
            _componentContext = componentContext;
        }

        public TDestination Map<TDestination>(object source)
        {
            return Mapper.Map<TDestination>(source, options => options.ConstructServicesUsing(_componentContext.Resolve));
        }

        public TDestination Map<TSource, TDestination>(TSource source)
        {
            return Mapper.Map<TSource, TDestination>(source, options => options.ConstructServicesUsing(_componentContext.Resolve));
        }

    }

}