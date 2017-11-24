using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyExecution.Request;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.NodeCursorTests
{
    [TestClass]
    public class NodeCursor_ReturnFromGotoFolder_Should
    {
        private NodeCursor _sut;
        private RequestState _requestState;
        private Folder _folder2;
        private Folder _child3;

        [TestInitialize]
        public void Init()
        {
            var topFolder = new Folder("topFolder") {Id = "1"};
            var folder1 = new Folder("folder1") {Id = "2"};
            var child1 = new Folder("child1") {Id = "3"};
            folder1.ChildNodes.Add(child1);
            _folder2 = new Folder("folder2") {Id = "4"};
            var child2 = new Folder("child2") {Id = "5"};
            _folder2.ChildNodes.Add(child2);
            _child3 = new Folder("child3") {Id = "6"};
            _folder2.ChildNodes.Add(_child3);

            topFolder.ChildNodes.Add(folder1);
            topFolder.ChildNodes.Add(_folder2);

            _requestState = new RequestState();
            var requestContext = new RequestContext
            {
                Direction = Direction.Forward,
                State = _requestState,
                NodeService = new NodeService(new Survey { TopFolder = topFolder }),
                Respondent = new Respondents.Respondent { Id = 0 }
            };
            _sut = new NodeCursor(topFolder, 0, requestContext);
        }

        [TestMethod]
        public void SetCurrentNodeToChild3()
        {
            _requestState.GotoStack.Items.Push(_child3.Id);
            _sut.ReturnFromGotoFolder();
            Assert.AreEqual(_child3, _sut.CurrentNode);
        }
    }
}