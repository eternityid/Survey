using Autofac;
using LearningPlatform.Data.EntityFramework.Repositories;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyLayout;

namespace LearningPlatform.Data.EntityFramework
{
    public class LegacyEntityFrameworkDataModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<SurveySqlRepository>().As<ISurveyRepository>().InstancePerLifetimeScope();
            builder.RegisterType<ThemeSqlRepository>().As<IThemeRepository>().InstancePerLifetimeScope();
            builder.RegisterType<QuestionDefinitionRepository>().As<IQuestionDefinitionRepository>().InstancePerLifetimeScope();
            builder.RegisterType<QuestionValidationRepository>().As<IQuestionValidationRepository>().InstancePerLifetimeScope();
            builder.RegisterType<LanguageStringRepository>().As<ILanguageStringRepository>().InstancePerLifetimeScope();
            builder.RegisterType<OptionListRepository>().As<IOptionListRepository>().InstancePerLifetimeScope();
            builder.RegisterType<PageDefinitionRepository>().As<IPageDefinitionRepository>().InstancePerLifetimeScope();
            builder.RegisterType<LayoutRepository>().As<ILayoutRepository>().InstancePerLifetimeScope();
            builder.RegisterType<ExpressionRepository>().As<IExpressionRepository>().InstancePerLifetimeScope();
            builder.RegisterType<SkipCommandRepository>().As<ISkipCommandRepository>().InstancePerLifetimeScope();
        }
    }
}