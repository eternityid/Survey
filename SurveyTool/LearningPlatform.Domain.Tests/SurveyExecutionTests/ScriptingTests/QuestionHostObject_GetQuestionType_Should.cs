using Autofac.Extras.Moq;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Scripting;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.ScriptingTests
{
    [TestClass]
    public class QuestionHostObject_GetQuestionType_Should
    {
        private AutoMock _autoMock;

        [TestInitialize]
        public void Init()
        {
            _autoMock = AutoMock.GetLoose();
            _autoMock.ProvideRequestContext(_autoMock.CreateSurvey(), 5);
        }



        [TestMethod]
        public void ReturnMultipleSelectionQuestion()
        {
            Question question = new MultipleSelectionQuestion {Alias = TestSurveyFactory.Question1Id};
            _autoMock.Mock<IQuestionService>().Setup(o => o.GetQuestion(question.Alias)).Returns(question);

            var sut = new QuestionHostObject(TestSurveyFactory.Question1Id, _autoMock.Container);
            string result = sut.type;
            Assert.AreEqual("MultipleSelectionQuestion", result);
        }

        [TestMethod]
        public void ReturnSingleSelectionQuestion()
        {
            Question question = new SingleSelectionQuestion {Alias = TestSurveyFactory.Question1Id};
            _autoMock.Mock<IQuestionService>().Setup(o => o.GetQuestion(question.Alias)).Returns(question);

            var sut = new QuestionHostObject(TestSurveyFactory.Question1Id, _autoMock.Container);
            string result = sut.type;
            Assert.AreEqual("SingleSelectionQuestion", result);
        }

    }
}