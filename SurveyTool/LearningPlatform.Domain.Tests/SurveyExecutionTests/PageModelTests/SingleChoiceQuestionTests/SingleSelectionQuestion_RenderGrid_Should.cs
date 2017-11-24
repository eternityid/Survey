using Autofac.Extras.Moq;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Scripting;
using LearningPlatform.Domain.SurveyExecution.TableLayout;
using LearningPlatform.TestFramework;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.PageModelTests.SingleSelectionQuestionTests
{
    [TestClass]
    public class SingleSelectionQuestion_RenderGrid_Should
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
        public void RenderTableWithCheckBoxes()
        {
            SingleSelectionQuestion singleSelectionQuestion = _create.SingleSelection("q1", "heading", "text", null,
                _create.Option("1", ""),
                _create.Option("2", ""));

            var actual = new Table {Transposed = true};
            singleSelectionQuestion.RenderGrid(actual);

            var expected = new[]
            {
                new ITableCell[]
                {
                    new LabelCell {Title = "heading", Description = "text"},
                    new LabelCell(),
                    new RadioButton {Checked = false, Alias = "1", Id = "q1"},
                    new RadioButton {Checked = false, Alias = "2", Id = "q1"}
                }
            };

            TableAssert.AreEqual(expected, actual);
        }

        [TestMethod]
        public void RenderTableWithCheckBoxesAndOneChecked()
        {
            const string answer = "2";
            SingleSelectionQuestion singleSelectionQuestion = _create.SingleSelection("q1", "heading", "text", answer,
                _create.Option("1", ""),
                _create.Option("2", ""),
                _create.Option("3", ""));

            var actual = new Table{Transposed = true};
            singleSelectionQuestion.RenderGrid(actual);

            var expected = new[]
            {
                new ITableCell[]
                {
                    new LabelCell {Title = "heading", Description = "text"},
                    new LabelCell(),
                    new RadioButton {Checked = false, Alias = "1", Id = "q1"},
                    new RadioButton {Checked = true, Alias = "2", Id = "q1"},
                    new RadioButton {Checked = false, Alias = "3", Id = "q1"}
                }
            };

            TableAssert.AreEqual(expected, actual);
        }
    }
}