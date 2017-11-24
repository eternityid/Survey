using Autofac.Extras.Moq;
using LearningPlatform.Domain.Constants;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Scripting;
using LearningPlatform.Domain.SurveyExecution.Validators;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.PageModelTests.ValidatorTests
{
    [TestClass]
    public class RequiredValidatorShould
    {
        private const string ErrorMessage = @"Question is required";
        private Page _page;
        private AutoMock _autoMock;

        [TestInitialize]
        public void Init()
        {
            _page = new Page(new Question[0]);
            _autoMock = AutoMock.GetLoose();
            _autoMock.Mock<IResourceManager>()
                .Setup(p => p.GetString(ValidationConstants.QuestionRequired, "q1"))
                .Returns(ErrorMessage);
            _autoMock.Mock<IScriptExecutor>().Setup(p => p.EvaluateString("q1")).Returns("q1");
        }


        [TestMethod]
        public void AddErrorIfAnswerIsNull()
        {
            var sut = _autoMock.Create<RequiredValidator>();

            sut.Validate(_page, new OpenEndedShortTextQuestion { TitleEvaluationString = EvaluationStringFactory.Create("q1", _autoMock) });

            Assert.AreEqual(1, _page.Errors.Count);
            Assert.AreEqual(ErrorMessage, _page.Errors[0].Message);
        }

        [TestMethod]
        public void AddErrorIfAnswerIsEmpty()
        {
            var openEndedTextQuestion = new OpenEndedShortTextQuestion { TitleEvaluationString = EvaluationStringFactory.Create("q1", _autoMock), Answer = "" };
            var sut = _autoMock.Create<RequiredValidator>();

            sut.Validate(_page, openEndedTextQuestion);

            Assert.AreEqual(1, _page.Errors.Count);
            Assert.AreEqual(ErrorMessage, _page.Errors[0].Message);
        }

        [TestMethod]
        public void AddErrorIfNoAnswerForMultipleSelection()
        {
            var multipleSelectionQuestion = new MultipleSelectionQuestion { TitleEvaluationString = EvaluationStringFactory.Create("q1", _autoMock)};
            var sut = _autoMock.Create<RequiredValidator>();

            sut.Validate(_page, multipleSelectionQuestion);

            Assert.AreEqual(1, _page.Errors.Count);
            Assert.AreEqual(ErrorMessage, _page.Errors[0].Message);
        }


        [TestMethod]
        public void AddErrorIfAllAnswersAreUncheckedForMultipleSelection()
        {
            var multipleSelectionQuestion = new MultipleSelectionQuestion { Alias = "q1", TitleEvaluationString = EvaluationStringFactory.Create("q1", _autoMock)};
            multipleSelectionQuestion.MultipleSelectionAnswer.AddAnswer("1", false);
            multipleSelectionQuestion.MultipleSelectionAnswer.AddAnswer("2", false);

            var sut = _autoMock.Create<RequiredValidator>();

            sut.Validate(_page, multipleSelectionQuestion);

            Assert.AreEqual(1, _page.Errors.Count);
            Assert.AreEqual(ErrorMessage, _page.Errors[0].Message);
        }


        [TestMethod]
        public void NotAddAnyErrorsIfMultipleSelectionQuestionIsAnswered()
        {
            var multipleSelectionQuestion = new MultipleSelectionQuestion { Alias = "q1" };
            multipleSelectionQuestion.MultipleSelectionAnswer.AddAnswer("1", false);
            multipleSelectionQuestion.MultipleSelectionAnswer.AddAnswer("2", true);
            var sut = _autoMock.Create<RequiredValidator>();
            sut.Validate(_page, multipleSelectionQuestion);

            Assert.AreEqual(0, _page.Errors.Count);
        }


        [TestMethod]
        public void NotAddAnyErrorsIfAnswered()
        {
            var openEndedTextQuestion = new OpenEndedShortTextQuestion {Alias = "q1", Answer = "answer text"};
            var sut = _autoMock.Create<RequiredValidator>();

            sut.Validate(_page, openEndedTextQuestion);

            Assert.AreEqual(0, _page.Errors.Count);
        }

    }
}