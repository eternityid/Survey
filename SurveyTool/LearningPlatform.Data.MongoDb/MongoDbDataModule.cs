using Autofac;
using LearningPlatform.Data.MongoDb.DemoData;
using LearningPlatform.Data.MongoDb.Repositories;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyLayout;

namespace LearningPlatform.Data.MongoDb
{
    public class MongoDbDataModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<RequestObjectProvider<MongoDbContext>>().As<IRequestObjectProvider<MongoDbContext>>().InstancePerLifetimeScope();
            builder.RegisterType<SurveyRepository>().As<ISurveyRepository>().InstancePerLifetimeScope();
            builder.RegisterType<LayoutRepository>().As<ILayoutRepository>().InstancePerLifetimeScope();
            builder.RegisterType<ThemeRepository>().As<IThemeRepository>().InstancePerLifetimeScope();
            builder.RegisterType<QuestionDefinitionRepository>().As<IQuestionDefinitionRepository>().InstancePerLifetimeScope();
            builder.RegisterType<OptionListRepository>().As<IOptionListRepository>().InstancePerLifetimeScope();
            builder.RegisterType<NodeRepository>().As<INodeRepository>().InstancePerLifetimeScope();

            builder.RegisterType<CompanyRepository>().As<ICompanyRepository>().InstancePerLifetimeScope();
            builder.RegisterType<UserRepository>().As<IUserRepository>().InstancePerLifetimeScope();

            builder.RegisterType<LibraryRepository>().As<ILibraryRepository>().InstancePerLifetimeScope();
            builder.RegisterType<LibrarySurveyRepository>().As<ILibrarySurveyRepository>().InstancePerLifetimeScope();
            builder.RegisterType<LibraryQuestionRepository>().As<ILibraryQuestionRepository>().InstancePerLifetimeScope();
            builder.RegisterType<LibraryNodeRepository>().As<ILibraryNodeRepository>().InstancePerLifetimeScope();

            builder.RegisterType<SimpleSurveyDefinitionDemo>().InstancePerLifetimeScope();
            builder.RegisterType<ComplexSurveyDefinitionDemo>().InstancePerLifetimeScope();
            builder.RegisterType<LoopSurveyDefinitionDemo>().InstancePerLifetimeScope();
            builder.RegisterType<CarryOverOptionsSurveyDefinitionDemo>().InstancePerLifetimeScope();
            builder.RegisterType<QuestionExpressionMaskDemo>().InstancePerLifetimeScope();
            builder.RegisterType<UiTestKeyboardSurveyDefinitionDemo>().InstancePerLifetimeScope();
            builder.RegisterType<SkipSurveyDefinitionDemo>().InstancePerLifetimeScope();
            builder.RegisterType<ConditionSurveyDefinitionDemo>().InstancePerLifetimeScope();
            builder.RegisterType<NestedLoopSurveyDefinitionDemo>().InstancePerLifetimeScope();
            builder.RegisterType<E2ESurveyDefinitionDemo>().InstancePerLifetimeScope();
            builder.RegisterType<AlphabeticalOptionOrderingSurveyDefinitionDemo>().InstancePerLifetimeScope();
            builder.RegisterType<RegexValidationSurveyDefinitionDemo>().InstancePerLifetimeScope();
            builder.RegisterType<OptionGroupSurveyDefinitionDemo>().InstancePerLifetimeScope();
            builder.RegisterType<TextListSurveyDefinitionDemo>().InstancePerLifetimeScope();
            builder.RegisterType<CustomNavigationTextSurveyDefinitionDemo>().InstancePerLifetimeScope();
            builder.RegisterType<LanguageSelectionSurveyDefinitionDemo>().InstancePerLifetimeScope();

            builder.RegisterType<MongoDbDataSeeder>().As<IDataSeeder>().InstancePerLifetimeScope();

            MongoDbMappings.Map();
        }

    }
}