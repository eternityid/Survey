using Autofac.Extras.Moq;
using AutoMapper;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Mappings;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyExecution.Options;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Scripting;
using LearningPlatform.TestFramework;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.FactoriesTests
{
    //TODO: Tests fails if run in isolation.
    [TestClass]
    public class QuestionFactory_CreateQuestion_Should
    {
        private SurveyDesign.SurveyDesign _create;
        private AutoMock _autoMock;
        public TestContext TestContext { get; set; }

        [TestInitialize]
        public void Init()
        {
            const int respondentId = 1;
            _autoMock = AutoMock.GetLoose();
            Mapper.Initialize(cfg =>
            {
                cfg.AddProfile(new DomainAutoMapperProfile());
            });

            _autoMock.ProvideRequestContext(new Survey { Id = "10" }, respondentId);
            _autoMock.Mock<IScriptExecutor>().Setup(scriptExecutor => scriptExecutor.EvaluateString(It.IsAny<string>())).Returns((string p) => p);

            _create = _autoMock.Create<SurveyDesign.SurveyDesign.Factory>().Invoke();
        }

        [TestMethod]
        public void ReturnGridSingleSelectionQuestion()
        {
            const string questionId = "single";
            var gridQuestionDefinition = _create.SingleSelectionGridQuestion(questionId, "Title", "Single",
                _create.SingleSelectionQuestion("", "", "",
                    q => q.OrderType = OrderType.InOrder,
                    _create.Option("1", text: "1"),
                    _create.Option("2", text: "2"),
                    _create.Option("3", text: "3")),
                q => q.OrderType = OrderType.InOrder,
                _create.Option("10", text: "Q1"),
                _create.Option("20", text: "Q2"),
                _create.Option("30", text: "Q3"));
            _autoMock.Mock<INodeService>().Setup(p => p.GetQuestionDefinitionByAlias(questionId)).Returns(gridQuestionDefinition);

            var sut = _autoMock.Create<QuestionFactory>();
            var question = sut.CreateQuestion(questionId);
            var gridQuestion = question as GridQuestion;

            Assert.IsNotNull(gridQuestion);
            QuestionAssert.AreEqual(new SingleSelectionQuestion { Alias = "single_10" }, gridQuestion.Questions[0]);
            QuestionAssert.AreEqual(new SingleSelectionQuestion { Alias = "single_20" }, gridQuestion.Questions[1]);
            QuestionAssert.AreEqual(new SingleSelectionQuestion { Alias = "single_30" }, gridQuestion.Questions[2]);
        }

        [TestMethod]
        public void ReturnListMultipleSelectionQuestion()
        {
            const string questionId = "multi";
            var gridQuestionDefinition = _create.SingleSelectionGridQuestion(questionId, "Title", "Description",
                _create.MultipleSelectionQuestion("", "", "",
                    q => q.OrderType = OrderType.InOrder,
                    _create.Option("1", text: "1"),
                    _create.Option("2", text: "2"),
                    _create.Option("3", text: "3")),
                q => q.OrderType = OrderType.InOrder,
                _create.Option("10", text: "Q1"),
                _create.Option("20", text: "Q2"),
                _create.Option("30", text: "Q3"));
            _autoMock.Mock<INodeService>().Setup(p => p.GetQuestionDefinitionByAlias(questionId)).Returns(gridQuestionDefinition);

            var sut = _autoMock.Create<QuestionFactory>();
            var question = sut.CreateQuestion(questionId);
            var gridQuestion = question as GridQuestion;

            Assert.IsNotNull(gridQuestion);
            QuestionAssert.AreEqual(new MultipleSelectionQuestion { Alias = "multi_10" }, gridQuestion.Questions[0]);
            QuestionAssert.AreEqual(new MultipleSelectionQuestion { Alias = "multi_20" }, gridQuestion.Questions[1]);
            QuestionAssert.AreEqual(new MultipleSelectionQuestion { Alias = "multi_30" }, gridQuestion.Questions[2]);
        }


        [TestMethod]
        public void ReturnListOpenEndedTestQuestionRotated()
        {
            const string questionId = "open";
            var gridQuestionDefinition = _create.SingleSelectionGridQuestion(questionId, "Title", "Description",
                _create.OpenEndedShortTextQuestion("", "", ""),
                q => q.OrderType = OrderType.Rotated, //TODO: Check how OrderType affects list questions
                _create.Option("10", text: "Q1"),
                _create.Option("20", text: "Q2"),
                _create.Option("30", text: "Q3"));
            _autoMock.Mock<INodeService>().Setup(p => p.GetQuestionDefinitionByAlias(questionId)).Returns(gridQuestionDefinition);

            var sut = _autoMock.Create<QuestionFactory>();
            var question = sut.CreateQuestion(questionId);
            var gridQuestion = question as GridQuestion;

            Assert.IsNotNull(gridQuestion);
            QuestionAssert.AreEqual(new OpenEndedShortTextQuestion { Alias = "open_20" }, gridQuestion.Questions[0]);
            QuestionAssert.AreEqual(new OpenEndedShortTextQuestion { Alias = "open_30" }, gridQuestion.Questions[1]);
            QuestionAssert.AreEqual(new OpenEndedShortTextQuestion { Alias = "open_10" }, gridQuestion.Questions[2]);
        }


        [TestMethod]
        public void ReturnMaxtrixQuestion()
        {
            const string questionId = "grid";
            var matrixQuestionDefinition = _create.MatrixQuestion(questionId, "", "",
                new QuestionWithOptionsDefinition[]
                {
                    _create.SingleSelectionQuestion("single", "Sub Title", "Sub Single"),
                    _create.MultipleSelectionQuestion("multi", "Title", "Description")
                },
                q => q.OrderType = OrderType.InOrder,
                _create.Option("10", text: "Q1"),
                _create.Option("20", text: "Q2"));
            _autoMock.Mock<INodeService>().Setup(p => p.GetQuestionDefinitionByAlias(questionId)).Returns(matrixQuestionDefinition);

            var sut = _autoMock.Create<QuestionFactory>();
            var question = sut.CreateQuestion(questionId);
            var matrixQuestion = question as MatrixQuestion;

            Assert.IsNotNull(matrixQuestion);
            var options = new[]
            {
                new Option {Alias = "10", TextEvaluationString = EvaluationStringFactory.Create("Q1", _autoMock)},
                new Option {Alias = "20", TextEvaluationString = EvaluationStringFactory.Create("Q2", _autoMock)}
            };
            QuestionAssert.AreEqual(new SingleSelectionQuestion { Alias = "single", Options = options },
                matrixQuestion.Questions[0]);
            QuestionAssert.AreEqual(new MultipleSelectionQuestion { Alias = "multi", Options = options },
                matrixQuestion.Questions[1]);
        }
    }
}
