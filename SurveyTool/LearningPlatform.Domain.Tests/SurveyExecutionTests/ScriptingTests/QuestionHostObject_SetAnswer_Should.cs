using Autofac.Extras.Moq;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Scripting;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.ScriptingTests
{
    [TestClass]
    public class QuestionHostObject_SetAnswer_Should
    {
        private AutoMock _autoMock;

        [TestInitialize]
        public void Init()
        {
            _autoMock = AutoMock.GetLoose();

            _autoMock.ProvideRequestContext(_autoMock.CreateSurvey(), 5);
        }


        [TestMethod]
        public void SaveAnswerForOpenEndedQuestion()
        {
            var openQuestion = new OpenEndedShortTextQuestion {Alias = TestSurveyFactory.Question1Id};
            _autoMock.Mock<IQuestionService>().Setup(o => o.GetQuestion(openQuestion.Alias)).Returns(openQuestion);

            var sut = new QuestionHostObject(TestSurveyFactory.Question1Id, _autoMock.Container);
            sut.answer = "abc";
            _autoMock.Mock<IQuestionService>().Verify(repository => repository.SaveQuestion(openQuestion));
        }

    }
}