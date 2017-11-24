using Autofac;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SampleData;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.LanguageStrings;
using LearningPlatform.Domain.SurveyDesign.Services.Page;
using LearningPlatform.Domain.SurveyDesign.Services.Question;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyExecution.Engine.ExecuteCommands;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using LearningPlatform.Domain.SurveyExecution.Scripting;
using LearningPlatform.Domain.SurveyExecution.Validators;

namespace LearningPlatform.Domain
{
    public class DomainModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<RequestObjectProvider<IRequestContext>>().As<IRequestObjectProvider<IRequestContext>>().InstancePerLifetimeScope();
            builder.RegisterType<RequestContextWrapper>().As<IRequestContext>().InstancePerLifetimeScope();
            builder.RegisterType<ScriptExecutor>().As<IScriptExecutor>().InstancePerLifetimeScope();
            builder.RegisterType<QuestionService>().As<IQuestionService>().InstancePerLifetimeScope();
            builder.RegisterType<ScriptCodeReader>().As<IScriptCodeReader>().InstancePerLifetimeScope();
            builder.RegisterType<HostObject>().As<IHostObject>().InstancePerLifetimeScope();
            builder.RegisterType<PageExecutor>().As<IPageExecutor>().InstancePerLifetimeScope();
            builder.RegisterType<LanguageStringFactory>().InstancePerLifetimeScope();
            builder.RegisterType<PageValidator>().As<IPageValidator>().InstancePerLifetimeScope();
            builder.RegisterType<PageFactory>().InstancePerLifetimeScope();
            builder.RegisterType<UploadFileService>().As<IUploadFileService>().InstancePerLifetimeScope();
            builder.RegisterType<EvaluationString>();
            builder.RegisterType<ConditionExecuteCommand>().InstancePerLifetimeScope();
            builder.RegisterType<GoToFolderExecuteCommand>().InstancePerLifetimeScope();
            builder.RegisterType<FolderExecuteCommand>().InstancePerLifetimeScope();
            builder.RegisterType<ScriptExecuteCommand>().InstancePerLifetimeScope();
            builder.RegisterType<NodeExecutor>().As<INodeExecutor>().InstancePerLifetimeScope();
            builder.RegisterType<QuestionFactory>().As<IQuestionFactory>().InstancePerLifetimeScope();
            builder.RegisterType<ResponseRowFactory>().As<IResponseRowFactory>().InstancePerLifetimeScope();
            builder.RegisterType<NodeServiceCache>().As<INodeServiceCache>().InstancePerLifetimeScope();
            builder.RegisterType<LoopService>().InstancePerLifetimeScope();
            builder.RegisterType<SurveyResourceManager>().As<IResourceManager>().InstancePerLifetimeScope();
            builder.RegisterType<ThreadSafeRandom>().As<IThreadSafeRandom>().InstancePerLifetimeScope();
            builder.RegisterType<JavascriptExpressionBuilder>().As<IExpressionBuilder>().InstancePerLifetimeScope();
            builder.RegisterType<MoveQuestionService>().InstancePerLifetimeScope();
            builder.RegisterType<MovePageService>().InstancePerLifetimeScope();
            builder.RegisterType<ReadSurveyService>().As<IReadSurveyService>().InstancePerLifetimeScope();

            //register seed sample data
            builder.RegisterType<SimpleSurveyDefinitionSample>().InstancePerLifetimeScope();
            builder.RegisterType<ComplexSurveyDefinitionSample>().InstancePerLifetimeScope();
            builder.RegisterType<LoopSurveyDefinitionSample>().InstancePerLifetimeScope();
            builder.RegisterType<CarryOverOptionsSurveyDefinitionSample>().InstancePerLifetimeScope();
            builder.RegisterType<QuestionExpressionMaskSample>().InstancePerLifetimeScope();
            builder.RegisterType<UiTestKeyboardSurveyDefinitionSample>().InstancePerLifetimeScope();

            builder.RegisterType<SkipSurveyDefinitionSample>().InstancePerLifetimeScope();
            builder.RegisterType<ConditionSurveyDefinitionSample>().InstancePerLifetimeScope();
            builder.RegisterType<NestedLoopSurveyDefinitionSample>().InstancePerLifetimeScope();
            builder.RegisterType<E2ESurveyDefinitionSample>().InstancePerLifetimeScope();
            builder.RegisterType<AlphabeticalOptionOrderingSurveyDefinitionSample>().InstancePerLifetimeScope();
            builder.RegisterType<RegexValidationSurveyDefinitionSample>().InstancePerLifetimeScope();
            builder.RegisterType<OptionGroupSurveyDefinitionSample>().InstancePerLifetimeScope();
            builder.RegisterType<TextListSurveyDefinitionSample>().InstancePerLifetimeScope();
            builder.RegisterType<CustomNavigationTextSurveyDefinitionSample>().InstancePerLifetimeScope();
            builder.RegisterType<LanguageSelectionSurveyDefinitionSample>().InstancePerLifetimeScope();
        }

    }

}