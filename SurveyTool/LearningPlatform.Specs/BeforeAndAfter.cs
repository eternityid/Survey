using Autofac;
using Autofac.Features.ResolveAnything;
using AutoMapper;
using LearningPlatform.Application;
using LearningPlatform.Data.Memory;
using LearningPlatform.Data.Memory.Repositories;
using LearningPlatform.Domain;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Mappings;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;
using LearningPlatform.TestFramework;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs
{
    [Binding]
    public class BeforeAndAfter
    {
        private static IContainer _container;

        [BeforeTestRun]
        public static void BeforeTestRun()
        {
            var builder = new ContainerBuilder();
            builder.RegisterSource(new AnyConcreteTypeNotAlreadyRegisteredSource());
            builder.RegisterModule<ApplicationModule>();
            builder.RegisterModule<DomainModule>();
            builder.RegisterModule<DataMemoryAccessModule>();
            builder.RegisterModule<DomainMemoryAccessModule>();
            builder.RegisterType<ControlledRandomForTests>().As<IThreadSafeRandom>().InstancePerLifetimeScope();
            // Additional memory access for survey defintions (random data generator will not need this)
            builder.RegisterType<SurveyMemoryRepository>().As<ISurveyRepository>().InstancePerLifetimeScope();
            builder.RegisterType<SurveyMemoryContext>().InstancePerLifetimeScope();
            builder.RegisterType<ReadSurveyMemoryService>().As<IReadSurveyService>().InstancePerLifetimeScope();
            builder.RegisterType<OptionListMemoryRepository>().As<IOptionListRepository>().InstancePerLifetimeScope();
            builder.RegisterType<QuestionDefinitionMemoryRepository>().As<IQuestionDefinitionRepository>().InstancePerLifetimeScope();
            builder.RegisterType<NodeMemoryRepository>().As<INodeRepository>().InstancePerLifetimeScope();


            _container = builder.Build();
            ServiceLocator.Value = _container;
            _container.Resolve<MemoryLanguageStringsData>().InsertData();

            Mapper.Initialize(cfg =>
            {
                cfg.AddProfile<DomainAutoMapperProfile>();
            });
        }


        [AfterTestRun]
        public static void AfterTestRun()
        {
            _container.Dispose();
        }
    }
}