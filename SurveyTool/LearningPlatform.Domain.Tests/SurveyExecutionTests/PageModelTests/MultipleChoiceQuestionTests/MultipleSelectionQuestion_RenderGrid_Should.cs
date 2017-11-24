using Autofac.Extras.Moq;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Scripting;
using LearningPlatform.Domain.SurveyExecution.TableLayout;
using LearningPlatform.TestFramework;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.PageModelTests.MultipleSelectionQuestionTests
{
    [TestClass]
    public class MultipleSelectionQuestion_RenderGrid_Should
    {
        private AutoMock _autoMock;

        [TestInitialize]
        public void Init()
        {
            _autoMock = AutoMock.GetLoose();
            _autoMock.Mock<IScriptExecutor>().Setup(scriptExecutor => scriptExecutor.EvaluateString(It.IsAny<string>()))
                .Returns((string p) => p);
        }

        [TestMethod]
        public void RenderTableWithCheckBoxes()
        {
            var create = new QuestionForTestFactory(_autoMock);
            MultipleSelectionQuestion multipleSelectionQuestion = create.MultipleSelection("q1", "heading", "text", new string[0],
                create.Option("1", ""),
                create.Option("2", ""));

            var actual = new Table {Transposed = true};
            multipleSelectionQuestion.RenderGrid(actual);

            var expected = new[]
            {
                new ITableCell[]
                {
                    new LabelCell {Title = "heading", Description = "text"},
                    new LabelCell(),
                    new CheckBox {Checked = false, Alias = "1", Id = "q1_1"},
                    new CheckBox {Checked = false, Alias = "2", Id = "q1_2"}
                }
            };

            TableAssert.AreEqual(expected, actual);
        }

        [TestMethod]
        public void RenderTableWithCheckBoxesWhereOneIsChecked()
        {
            var create = new QuestionForTestFactory(_autoMock);
            var answerIndexes = new [] {"2"};
            MultipleSelectionQuestion multipleSelectionQuestion = create.MultipleSelection("q1", "heading", "text", answerIndexes,
                create.Option("1", ""),
                create.Option("2", ""),
                create.Option("3", ""));

            var actual = new Table {Transposed = true};
            multipleSelectionQuestion.RenderGrid(actual);

            var expected = new[]
            {
                new ITableCell[]
                {
                    new LabelCell {Title = "heading", Description = "text"},
                    new LabelCell(),
                    new CheckBox {Checked = false, Alias = "1", Id = "q1_1"},
                    new CheckBox {Checked = true, Alias = "2", Id = "q1_2"},
                    new CheckBox {Checked = false, Alias = "3", Id = "q1_3"}
                }
            };

            TableAssert.AreEqual(expected, actual);
        }


    }
}