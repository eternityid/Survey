using AutoMapper;
using LearningPlatform.Domain.Mappings;

namespace LearningPlatform
{
    public static class AutoMapperConfig
    {
        public static void Configure()
        {
            Mapper.Initialize(cfg =>
            {
                cfg.AddProfile<DomainAutoMapperProfile>();
            });
        }
    }
}