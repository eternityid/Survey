using System;
using System.Collections.Generic;
using Autofac.Extras.Moq;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyExecution.Scripting;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.PageModelTests.ExpressionScriptBuilderTests
{
    [TestClass]
    public class ExpressionScriptBuilder_WithOpenEndedText_Should
    {
        private AutoMock _autoMock;

        [TestInitialize]
        public void Init()
        {
            _autoMock = AutoMock.GetLoose();
            _autoMock.Mock<INodeService>().Setup(p => p.GetQuestionDefinitionById(It.IsAny<string>()))
                .Returns(
                    (string id) => new OpenEndedShortTextQuestionDefinition { Alias = "q" + id });
            _autoMock.ProvideRequestContext(new Survey(), 1);
            _autoMock.Provide<IExpressionBuilder>(new JavascriptExpressionBuilder());
        }

        [TestMethod]
        public void ReturnSimpleAndExpression()
        {
            var expressions = new ExpressionFactory("0").When(e => e
                .Question("1").IsEqual("'abc'")
                .And().Question("2").IsEqual("'hi'")).Build().ExpressionItems;


            var sut = _autoMock.Create<ExpressionQueryBuilder>();
            var result = sut.Build(expressions);
            Assert.AreEqual("(questions.q1.answer==='\\'abc\\'' && questions.q2.answer==='\\'hi\\'')", result);
        }

        [TestMethod]
        public void ReturnNestedExpression()
        {
            var expressions = new ExpressionFactory("0")
                .When(e => e
                    .Question("1").IsEqual("'a1'"))
                .AndWhen(f => f
                    .Question("2").IsEqual("'a2'")
                    .Or().Question("3").IsEqual("'a3'"))
                .Build().ExpressionItems;

            var sut = _autoMock.Create<ExpressionQueryBuilder>();
            var result = sut.Build(expressions);
            Assert.AreEqual("(questions.q1.answer==='\\'a1\\'') && (questions.q2.answer==='\\'a2\\'' || questions.q3.answer==='\\'a3\\'')", result);
        }

        [TestMethod]
        public void DoubleNestingInBeginningOfExpression()
        {
            var expressions = new ExpressionFactory("0")
                .When(e => e
                    .When(f => f
                        .Question("1").IsEqual("'a'")
                        .And().Question("2").IsEqual("'b'"))
                    .OrWhen(g => g
                        .Question("3").IsEqual("'c'")))
                .AndWhen(h => h
                    .Question("4").IsEqual("'d'"))
                .Build().ExpressionItems;

            var sut = _autoMock.Create<ExpressionQueryBuilder>();
            var result = sut.Build(expressions);
            Assert.AreEqual("((questions.q1.answer==='\\'a\\'' && questions.q2.answer==='\\'b\\'') || (questions.q3.answer==='\\'c\\'')) && (questions.q4.answer==='\\'d\\'')", result);
        }


        [TestMethod]
        public void ReturnExpressionWithParentheses()
        {
            // Normally you should start with When, but the expression builder supports also the following:
            var expressions = new ExpressionFactory("0")
                .Question("1").IsEqual("'a1'")
                .AndWhen(e => e
                    .Question("2").IsEqual("'a2'")
                ).Build().ExpressionItems;


            var sut = _autoMock.Create<ExpressionQueryBuilder>();
            var result = sut.Build(expressions);
            Assert.AreEqual("questions.q1.answer==='\\'a1\\'' && (questions.q2.answer==='\\'a2\\'')", result);
        }

        [TestMethod]
        public void ReturnComplexNestedExpression()
        {
            var expressions = new ExpressionFactory("0").
                When(d => d
                    .Question("1").IsEqual("'a1'"))
                .AndWhen(e => e
                    .Question("2").IsEqual("'a2'")
                    .Or().Question("3").IsEqual("'a3'")
                    .AndWhen(f => f
                        .Question("4").IsEqual("'a4'"))
                    .OrWhen(g => g
                        .Question("5").IsEqual("'a5'")))
                .Build().ExpressionItems;

            var sut = _autoMock.Create<ExpressionQueryBuilder>();
            var result = sut.Build(expressions);
            Assert.AreEqual("(questions.q1.answer==='\\'a1\\'') && (questions.q2.answer==='\\'a2\\'' || questions.q3.answer==='\\'a3\\'' && (questions.q4.answer==='\\'a4\\'') || (questions.q5.answer==='\\'a5\\''))", result);
        }

        [TestMethod]
        public void TwoGroupsAndOneNestedGroup()
        {
            var expressions = new ExpressionFactory("0")
                .When(e => e
                    .Question("1").IsEqual("'bmw'")
                    .Or().Question("1").IsEqual("'mercedes'")
                    .OrWhen(f => f
                        .Question("2").IsEqual("'dont drive'")
                        .And().Question("3").IsEqual("'like motorbike'"))
                ).AndWhen(e => e
                    .Question("4").IsEqual("'income greater than 10000'")
                    .Or().Question("3").IsEqual("'like motorbike'")).Build().ExpressionItems;

            var sut = _autoMock.Create<ExpressionQueryBuilder>();
            var result = sut.Build(expressions);
            Assert.AreEqual("(questions.q1.answer==='\\'bmw\\'' || questions.q1.answer==='\\'mercedes\\'' || (questions.q2.answer==='\\'dont drive\\'' && questions.q3.answer==='\\'like motorbike\\'')) && (questions.q4.answer==='\\'income greater than 10000\\'' || questions.q3.answer==='\\'like motorbike\\'')", result);
        }


        [TestMethod]
        public void ReturnCustomExpression()
        {
            var expressions = new List<ExpressionItem>()
            {
                new ExpressionItem
                {
                    Operator = ExpressionOperator.Custom,
                    Value ="customScript()"
                }
            };

            var sut = _autoMock.Create<ExpressionQueryBuilder>();
            var result = sut.Build(expressions);
            Assert.AreEqual("customScript()", result);
        }

        [TestMethod]
        public void ReturnCustomMixedExpression()
        {
            var expressions = new List<ExpressionItem>()
            {
                CreateExpression("1", ExpressionOperator.IsEqual, "'abc'", ExpressionLogicalOperator.And),
                new ExpressionItem
                {
                    Operator = ExpressionOperator.Custom,
                    Value ="customScript()"
                }
            };

            var sut = _autoMock.Create<ExpressionQueryBuilder>();
            var result = sut.Build(expressions);
            Assert.AreEqual("questions.q1.answer==='\\'abc\\'' && customScript()", result);
        }


        [TestMethod]
        [ExpectedException(typeof(InvalidOperationException))]
        public void ThrowExceptionDueToLogicalOperatorOnLastElement()
        {
            var expressions = new List<ExpressionItem>()
            {
                CreateExpression("1", ExpressionOperator.IsEqual, "'abc'", ExpressionLogicalOperator.And),
                CreateExpression("2", ExpressionOperator.IsEqual, "'hi'", ExpressionLogicalOperator.And)
            };

            var sut = _autoMock.Create<ExpressionQueryBuilder>();
            sut.Build(expressions);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidOperationException))]
        public void ThrowExceptionDueToLackOfLogicalOperator()
        {
            var expressions = new List<ExpressionItem>()
            {
                CreateExpression("1", ExpressionOperator.IsEqual, "'abc'", ExpressionLogicalOperator.And),
                CreateExpression("2", ExpressionOperator.IsEqual, "'abc'"),
                CreateExpression("3", ExpressionOperator.IsEqual, "'hi'")
            };

            var sut = _autoMock.Create<ExpressionQueryBuilder>();
            sut.Build(expressions);
        }

        [TestMethod]
        public void ReturnContainsExpression()
        {
            var expressions = new List<ExpressionItem>()
            {
                CreateExpression("1", ExpressionOperator.Contains, "'abc'", ExpressionLogicalOperator.Or),
                CreateExpression("2", ExpressionOperator.NotContains, "'hi'")
            };

            var sut = _autoMock.Create<ExpressionQueryBuilder>();
            var result = sut.Build(expressions);
            Assert.AreEqual("containsString(questions.q1.answer, '\\'abc\\'') || !containsString(questions.q2.answer, '\\'hi\\'')", result);
        }


        [TestMethod]
        public void ReturnSimpleOrExpression()
        {
            var expressions = new List<ExpressionItem>()
            {
                CreateExpression("1", ExpressionOperator.IsEqual, "'abc'", ExpressionLogicalOperator.Or),
                CreateExpression("2", ExpressionOperator.IsEqual, "'hi'")
            };

            var sut = _autoMock.Create<ExpressionQueryBuilder>();
            var result = sut.Build(expressions);
            Assert.AreEqual("questions.q1.answer==='\\'abc\\'' || questions.q2.answer==='\\'hi\\''", result);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidOperationException))]
        public void ThrowExceptionDueToIdentIncrease()
        {
            var expressions = new List<ExpressionItem>()
            {
                CreateExpression("1", ExpressionOperator.IsEqual, "'a1'", ExpressionLogicalOperator.And),
                CreateExpression("2", ExpressionOperator.IsEqual, "'a2'", ExpressionLogicalOperator.Or, indent:2),  //Not allowed (from 0 to 2)
                CreateExpression("3", ExpressionOperator.IsEqual, "'a3'"),
            };

            var sut = _autoMock.Create<ExpressionQueryBuilder>();
            sut.Build(expressions);
        }

        private static ExpressionItem CreateExpression(string questionId, ExpressionOperator? expressionOperator, string value, ExpressionLogicalOperator? expressionLogicalOperator=null, int indent = 0)
        {
            return new ExpressionItem
            {
                Indent = indent,
                LogicalOperator = expressionLogicalOperator,
                QuestionId = questionId,
                Operator = expressionOperator,
                Value = value,
            };
        }

    }
}