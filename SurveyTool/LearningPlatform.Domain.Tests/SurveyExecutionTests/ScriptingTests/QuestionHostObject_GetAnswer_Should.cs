using System.Linq;
using Autofac.Extras.Moq;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Scripting;
using Microsoft.ClearScript;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.ScriptingTests
{
    [TestClass]
    public class QuestionHostObject_GetAnswer_Should
    {
        private AutoMock _autoMock;

        [TestInitialize]
        public void Init()
        {
            _autoMock = AutoMock.GetLoose();
        }

        [TestMethod]
        public void ReturnEmptyPropertyBagWithMultipleSelection2()
        {
            var survey = _autoMock.CreateSurveyWithMultipleSelectionQuestion(OrderType.InOrder);
            _autoMock.ProvideRequestContext(survey, 5);

            var multipleSelectionQuestion = new MultipleSelectionQuestion { Alias = TestSurveyFactory.Question1Id, };
            multipleSelectionQuestion.MultipleSelectionAnswer.AddAnswer("1", true);
            multipleSelectionQuestion.MultipleSelectionAnswer.AddAnswer("2", false);
            multipleSelectionQuestion.MultipleSelectionAnswer.AddAnswer("3", true);
            string alias = TestSurveyFactory.Question1Id;
            _autoMock.Mock<IQuestionService>().Setup(o => o.GetQuestion(alias)).Returns(multipleSelectionQuestion);

            var sut = new QuestionHostObject(alias, _autoMock.Container);

            var result = sut.answer as PropertyBag;
            Assert.IsNotNull(result);
            Assert.AreEqual(3, result.Count());
        }


        [TestMethod]
        public void ReturnAbcWithOpenEndedQuestion()
        {
            var survey = _autoMock.CreateSurveyWithOpenEndedQuestion();
            _autoMock.ProvideRequestContext(survey, 5);

            string alias = TestSurveyFactory.Question1Id;
            _autoMock.Mock<IQuestionService>().Setup(o => o.GetQuestion(alias)).Returns(new OpenEndedShortTextQuestion {Alias = TestSurveyFactory.Question1Id, Answer = "Abc"});
            var sut = new QuestionHostObject(alias, _autoMock.Container);

            object result = sut.answer;
            Assert.AreEqual("Abc", result);
        }



    }
}