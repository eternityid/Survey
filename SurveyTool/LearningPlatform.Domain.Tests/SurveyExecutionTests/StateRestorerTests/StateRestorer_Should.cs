using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyExecution.Request;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.StateRestorerTests
{
    [TestClass]
    public class StateRestorer_Should
    {

        [TestMethod]
        public void PreserveGotoStack()
        {
            var requestState = new RequestState();
            requestState.GotoStack.Items.Push("0");
            using (new StateRestorer(requestState))
            {
                requestState.GotoStack.Items.Clear();
            }
            Assert.AreEqual(1, requestState.GotoStack.Items.Count);
        }

        [TestMethod]
        public void PreserveQuestionIdsToClean()
        {
            var requestState = new RequestState();
            requestState.QuestionAliasesToClean.Add("q1");
            using (new StateRestorer(requestState))
            {
                requestState.QuestionAliasesToClean.Add("q2");
            }

            Assert.AreEqual(1, requestState.QuestionAliasesToClean.Count);
            Assert.AreEqual("q1", requestState.QuestionAliasesToClean[0]);
        }

    }
}