using System.Linq;
using Autofac.Extras.Moq;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Scripting;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.ScriptingTests
{
    [TestClass]
    public class QuestionHostObject_GetOptions_Should
    {
        private AutoMock _autoMock;

        [TestInitialize]
        public void Init()
        {
            _autoMock = AutoMock.GetLoose();
        }


        [TestMethod]
        public void GetOptions_MultiQuestionDefintion_OptionsReturned()
        {
            var survey = _autoMock.CreateSurveyWithMultipleSelectionQuestion(OrderType.InOrder);
            _autoMock.ProvideRequestContext(survey, 5, new NodeService(survey));
            string alias = TestSurveyFactory.Question1Id;
            _autoMock.Mock<IQuestionService>().Setup(o => o.GetQuestion(alias)).Returns((Question) null);

            var sut = new QuestionHostObject(alias, _autoMock.Container);
            var result = sut.options;
            CollectionAssert.AreEquivalent(new[] {"1", "2", "3"}, result.ToList());
        }

        [TestMethod]
        public void GetOptions_OpenQuestionDefintion_EmptyCollection()
        {
            Survey survey = _autoMock.CreateSurveyWithOpenEndedQuestion();
            _autoMock.ProvideRequestContext(survey, 5);

            var sut = new QuestionHostObject(TestSurveyFactory.Question1Id, _autoMock.Container);
            var result = sut.options;
            Assert.AreEqual(0, result.Count);
        }

    }
}