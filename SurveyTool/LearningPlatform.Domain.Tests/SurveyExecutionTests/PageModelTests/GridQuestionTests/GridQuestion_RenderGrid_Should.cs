using System.Collections.Generic;
using Autofac.Extras.Moq;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Scripting;
using LearningPlatform.Domain.SurveyExecution.TableLayout;
using LearningPlatform.TestFramework;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.PageModelTests.GridQuestionTests
{
    [TestClass]
    public class GridQuestion_RenderGrid_Should
    {
        private QuestionForTestFactory _create;
        private AutoMock _autoMock;

        [TestInitialize]
        public void Init()
        {
            _autoMock = AutoMock.GetLoose();
            _autoMock.Mock<IScriptExecutor>().Setup(scriptExecutor => scriptExecutor.EvaluateString(It.IsAny<string>()))
                .Returns((string p) => p);
            _create = new QuestionForTestFactory(_autoMock);
        }

        [TestMethod]
        public void RenderTranposedTableWithRadioButtons()
        {
            var sut = CreateGridQuestion(
                CreateSingleSelectionQuestion("s1_10", answer: "2"),
                CreateSingleSelectionQuestion("s1_20", answer: null));
            sut.Transposed = true;
            var actual = new Table();
            sut.RenderGrid(actual);

            var expect = new[]
            {
                new ITableCell[]
                {
                    new LabelCell(), new LabelCell {Description = "Q1"}, new LabelCell {Description = "Q2"}
                },
                new ITableCell[]
                {
                    new LabelCell {Description = "1"},
                    new RadioButton {Alias = "1", Id = "s1_10"},
                    new RadioButton {Alias = "1", Id = "s1_20"}
                },
                new ITableCell[]
                {
                    new LabelCell {Description = "2"},
                    new RadioButton {Checked = true, Alias = "2", Id = "s1_10"},
                    new RadioButton {Alias = "2", Id = "s1_20"}
                }
            };

            TableAssert.AreEqual(expect, actual);
        }

        [TestMethod]
        public void RenderTableWithRadioButtons()
        {
            var sut = CreateGridQuestion(
                CreateSingleSelectionQuestion("s1_10", answer: "2"),
                CreateSingleSelectionQuestion("s1_20", answer: null));
            var actual = new Table();
            sut.RenderGrid(actual);

            var expect = new[]
            {
                new ITableCell[]
                {
                    new LabelCell(), new LabelCell {Description = "1"}, new LabelCell {Description = "2"}
                },
                new ITableCell[]
                {
                    new LabelCell {Description = "Q1"}, new RadioButton {Alias = "1", Id = "s1_10"}, new RadioButton {Checked = true, Alias = "2", Id = "s1_10"}
                },
                new ITableCell[]
                {
                   new LabelCell {Description = "Q2"}, new RadioButton {Alias = "1", Id = "s1_20"}, new RadioButton {Alias = "2", Id = "s1_20"}
                }               
            };

            TableAssert.AreEqual(expect, actual);
        }

        [TestMethod]
        public void RenderTableWithCheckBoxes()
        {
            var sut = CreateGridQuestion(
                CreateMultipleSelectionQuestion("m1_10", answersIndices: new string[0]), 
                CreateMultipleSelectionQuestion("m1_20", answersIndices: new []{"2"}));
            sut.Transposed = true;
            var actual = new Table();
            sut.RenderGrid(actual);

            var expecte = new[]
            {
                new ITableCell[]
                {
                    new LabelCell(), new LabelCell {Description = "Q1"}, new LabelCell {Description = "Q2"}, new LabelCell ()
                },
                new ITableCell[]
                {
                    new LabelCell {Title = null, Description = "1", Span = null}, 
                    new CheckBox {Alias = "1", Id = "m1_10_1"},
                    new CheckBox {Alias = "1", Id = "m1_20_1"}
                },
                new ITableCell[]
                {
                    new LabelCell {Description = "2"},
                    new CheckBox {Alias = "2", Id = "m1_10_2"},
                    new CheckBox {Checked = true, Alias = "2", Id = "m1_20_2"}
                }
            };

            TableAssert.AreEqual(expecte, actual);
        }

        private SingleSelectionQuestion CreateSingleSelectionQuestion(string name, string answer)
        {
            var answers = new[] { _create.Option("1", "1"), _create.Option("2", "2") };
            var singleSelectionQuestion = _create.SingleSelection(name, "", "", answer, answers);
            return singleSelectionQuestion;
        }

        private MultipleSelectionQuestion CreateMultipleSelectionQuestion(string name, IEnumerable<string> answersIndices)
        {
            var answers = new[] { _create.Option("1", "1"), _create.Option("2", "2") };
            var multipleSelectionQuestion = _create.MultipleSelection(name, "h2", "t2", answersIndices,  answers);
            return multipleSelectionQuestion;
        }

        private GridQuestion CreateGridQuestion(Question question1, Question question2)
        {
            GridQuestion gridQuestion = _create.SingleSelectionGrid("list1", "heading", "text",
                new[]
                {
                    question1,
                    question2
                },
                _create.Option("10", "Q1"),
                _create.Option("20", "Q2"));
            return gridQuestion;
        }
    }
}