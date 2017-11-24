using AutoMapper;
using LearningPlatform.Application.Models;
using LearningPlatform.Domain.Mappings;
using LearningPlatform.Domain.SurveyExecution;

namespace LearningPlatform
{
    public static class AutoMapperConfig
    {
        public static void Configure()
        {
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Direction, NavigationDirection>();
                cfg.AddProfile<DomainAutoMapperProfile>();
            });
        }
    }
}