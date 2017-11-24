using LearningPlatform.Api;
using LearningPlatform.Api.SurveyExecution;
using LearningPlatform.Data;
using LearningPlatform.Data.Repositories.Sql;
using LearningPlatform.Data.SurveysDb;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Validation;
using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyExecution.Security;
using LearningPlatform.Models;
using Microsoft.Practices.Unity;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.IntegrationTests
{
    [TestClass]
    public class AnIntegrationTestUsedForTesting
    {
        private SurveysContext _context;
        private Survey _survey;
        static private readonly IUnityContainer _container;

        static AnIntegrationTestUsedForTesting()
        {
            AutoMapperConfig.Configure();

            _container = UnityConfig.GetConfiguredContainer();
            _container.RegisterType<IRequestObjectProvider<IRequestContext>, DummyRequestObjectProvider<IRequestContext>>(new ContainerControlledLifetimeManager());
            _container.RegisterType<IRequestObjectProvider<SurveysContext>, DummyRequestObjectProvider<SurveysContext>>(new ContainerControlledLifetimeManager());
            _container.RegisterType<INodeServiceCache, NodeServiceMemoryCache>(new ContainerControlledLifetimeManager());
        }

        [TestInitialize]
        public void InitTest()
        {
            var requestObjectProviderSurveyContext = _container.Resolve<IRequestObjectProvider<SurveysContext>>();
            requestObjectProviderSurveyContext.Set(null);


            var surveysContextProvider = _container.Resolve<SurveysContextProvider>();
            _context = surveysContextProvider.Get();

            new DatabaseDeleter(_context).DeleteAllObjects();

            var surveyRepository = _container.Resolve<ISurveyRepository>();
            var contextService = _container.Resolve<ContextService>();

            var create = new SurveyDesignFactory();

            _survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.MatrixQuestion("grid1", "", "",
                            new QuestionWithOptionsDefinition[]
                            {
                                create.MultipleSelectionQuestion("multi1", "", "multi1"),
                                create.SingleSelectionQuestion("single1", "", "single1"),
                                create.SingleSelectionGridQuestion("SingleList", "", "singleList",
                                    create.SingleSelectionQuestion("s1", "", "s1", q => q.OrderType = OrderType.InOrder,
                                        create.Option("1", text: "1"),
                                        create.Option("2", text: "2"),
                                        create.Option("3", text: "3")))
                            },
                            q=>q.OrderType = OrderType.InOrder,
                            create.Option("1", text: "V1"),
                            create.Option("2", text: "V2"),
                            create.Option("3", text: "V3")),
                        create.SingleSelectionGridQuestion("list", "", "",
                            create.SingleSelectionQuestion("listsingle1", "Sub Title", "Sub Single",
                                q => q.OrderType = OrderType.InOrder,
                                create.Option("1", text: "1"),
                                create.Option("2", text: "2"),
                                create.Option("3", text: "3")),
                            q => q.OrderType = OrderType.InOrder,
                            create.Option("1", text: "Q1"),
                            create.Option("2", text: "Q2"),
                            create.Option("3", text: "Q3"))
                        ),
                    create.Condition("condition", "question('age').answer===5",
                        create.Folder("trueFolder",
                            create.Page(
                                create.OpenEndedShortTextQuestion("question1",
                                    "Heading1  {{question('question2').answer['1']}}",
                                    "Text1. {{question('question1').answer}}", null,
                                    create.RequiredValidation()),
                                create.MultipleSelectionQuestion("question2",
                                    "Heading2 {{question('question2').mask = ['1', '3']}}",
                                    "Text2", q =>
                                    {
                                        q.Validations = new QuestionValidation[] { create.RequiredValidation() };
                                        q.OrderType = OrderType.Flipped;
                                    },
                                    create.Option("1", text: "Apple"),
                                    create.Option("2", text: "Microsoft"),
                                    create.Option("3", text: "IBM"))))),
                    create.Page(
                        create.NumericQuestion("age", "Your Age", "Please enter your age"),
                        create.SingleSelectionQuestion("question4", "Gender", "Please state your gender", q => q.OrderType = OrderType.InOrder,
                            create.Option("1", text: "Male"),
                            create.Option("2", text: "Female"),
                            create.Option("3", "Other", create.OpenEndedShortTextQuestion("genderOther", "", "", null, new QuestionValidation[] { create.RequiredValidation() }))),
                        create.SingleSelectionGridQuestion("multiList", "", "",
                            create.MultipleSelectionQuestion("multiInList", "", "",
                                question => question.OrderType = OrderType.InOrder,
                                create.Option("1", text: "List Multi 1"),
                                create.Option("2", text: "List Multi 2")),
                            q => q.OrderType = OrderType.InOrder,
                            create.Option("1", text: "Q1"),
                            create.Option("2", text: "Q2"))),
                    create.Page(
                        create.Information("Information", "Information", "You have completed the survey."))));
            surveyRepository.Add(_survey);
            contextService.SaveChanges();
        }



        //[TestMethod, Ignore]
        public void Test()
        {
            var surveyHandlerController = _container.Resolve<SurveyHandlerController>();
            var page = surveyHandlerController.Get(_survey.Id);

            ProtectedVariables protectedVariables = VariablesProtector.Unprotect(page.Context);
        }

        //[TestMethod, Ignore]
        public void Test2()
        {
            var surveyHandlerController = _container.Resolve<SurveyHandlerController>();
            var page = surveyHandlerController.Get(_survey.Id);
            page = surveyHandlerController.Post(_survey.Id,
                new Form { Context = page.Context, Direction = NavigationDirection.Forward });

            ProtectedVariables protectedVariables = VariablesProtector.Unprotect(page.Context);


        }


        [TestCleanup]
        public void CleanupTest()
        {
        }
    }
}
