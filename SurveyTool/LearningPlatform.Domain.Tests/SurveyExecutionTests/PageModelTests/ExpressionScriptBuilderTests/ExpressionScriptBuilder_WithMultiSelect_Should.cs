using Autofac.Extras.Moq;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyExecution.Scripting;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.PageModelTests.ExpressionScriptBuilderTests
{
    [TestClass]
    public class ExpressionScriptBuilder_WithMultiSelect_Should
    {
        private AutoMock _autoMock;

        [TestInitialize]
        public void Init()
        {
            _autoMock = AutoMock.GetLoose();
            var nodeServiceMock = _autoMock.Mock<INodeService>();
            nodeServiceMock.Setup(p => p.GetQuestionDefinitionById(It.IsAny<string>()))
                .Returns((string id) => new MultipleSelectionQuestionDefinition { Alias = "q" + id });
            nodeServiceMock.Setup(p => p.GetOption(It.IsAny<string>()))
                .Returns((string id) => new Option { Alias = "o" + id });
            _autoMock.Provide<IExpressionBuilder>(new JavascriptExpressionBuilder());
            _autoMock.ProvideRequestContext(new Survey(), 1, nodeServiceMock.Object);
        }

        [TestMethod]
        public void ReturnOptionsSelectedScript()
        {
            var expressions = new ExpressionFactory("0")
                .When(e => e
                    .Question("1").IsSelected("1")
                    .Or().Question("2").IsSelected("2")).Build().ExpressionItems;

            var sut = _autoMock.Create<ExpressionQueryBuilder>();
            var result = sut.Build(expressions);
            Assert.AreEqual("(contains(questions.q1.optionsSelected, 'o1') || contains(questions.q2.optionsSelected, 'o2'))", result);
        }

        [TestMethod]
        public void ReturnOptionsNotSelectedScript()
        {
            var expressions = new ExpressionFactory("0")
                .When(e => e
                    .Question("1").IsNotSelected("1")
                    .Or().Question("2").IsNotSelected("2")).Build().ExpressionItems;

            var sut = _autoMock.Create<ExpressionQueryBuilder>();
            var result = sut.Build(expressions);
            Assert.AreEqual("(contains(questions.q1.optionsNotSelected, 'o1') || contains(questions.q2.optionsNotSelected, 'o2'))", result);
        }

        [TestMethod]
        public void ReturnOptionsShownScript()
        {
            var expressions = new ExpressionFactory("0")
                .When(e => e
                    .Question("1").IsShown("1")
                    .And().Question("2").IsNotShown("2")).Build().ExpressionItems;

            var sut = _autoMock.Create<ExpressionQueryBuilder>();
            var result = sut.Build(expressions);
            Assert.AreEqual("(contains(questions.q1.optionsShown, 'o1') && !contains(questions.q2.optionsShown, 'o2'))", result);
        }
    }
}