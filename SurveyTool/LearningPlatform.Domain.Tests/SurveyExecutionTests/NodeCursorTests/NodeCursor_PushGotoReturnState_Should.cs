using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyExecution.Request;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.NodeCursorTests
{
    [TestClass]
    public class NodeCursor_PushGotoReturnState_Should
    {

        [TestMethod]
        public void PushReturnStateToGotoStack()
        {
            var topFolder = new Folder("topFolder") {Id = "0"};
            var child = new Folder("child") {Id = "1"};
            topFolder.ChildNodes.Add(child);
            topFolder.ChildNodes.Add(new Folder("child2"){Id="2"});
            var nodeService = new NodeService(new Survey{TopFolder = topFolder});
            const int index = 0;
            var requestContext = new RequestContext
            {
                Direction = Direction.Forward,
                State = new RequestState(),
                NodeService = nodeService
            };
            var sut = new NodeCursor(topFolder, index, requestContext);

            sut.PushGotoReturnState();
            var surveyPoint = requestContext.State.GotoStack.Items.Peek();
            Assert.AreEqual("2", surveyPoint);
        }


    }
}