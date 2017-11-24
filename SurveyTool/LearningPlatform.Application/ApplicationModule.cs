using System;
using Autofac;
using LearningPlatform.Application.SurveyExecution;
using LearningPlatform.Application.Respondents;

namespace LearningPlatform.Application
{
    public class ApplicationModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<SurveyAppService>().InstancePerLifetimeScope();
            builder.RegisterType<RespondentAppService>().InstancePerLifetimeScope();
        }
    }
}
