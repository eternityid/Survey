using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyExecution.Request;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.NodeCursorTests
{
    [TestClass]
    public class NodeCursor_CurrentNode_Should
    {
        private Folder _topFolder;
        private Node _child;
        private INodeService _nodeService;

        [TestInitialize]
        public void Init()
        {
            _topFolder = new Folder("topFolder") {Id = "1"};
            _child = new Folder("child") {Id = "3"};
            _topFolder.ChildNodes.Add(_child);
            _nodeService = new NodeService(new Survey { TopFolder = _topFolder });
        }

        [TestMethod]
        public void ReturnChild()
        {
            var sut = new NodeCursor(_topFolder, 0, CreateRequestContext());

            var result = sut.CurrentNode;
            Assert.AreEqual(_child, result);
        }

        [TestMethod]
        public void ReturnChild2()
        {
            var child2 = new PageDefinition {Alias = "child2", Id="4"};
            _topFolder.ChildNodes.Add(child2);
            _nodeService = new NodeService(new Survey { TopFolder = _topFolder });
            var sut = new NodeCursor(_topFolder, 1, CreateRequestContext());

            var result = sut.CurrentNode;
            Assert.AreEqual(child2, result);
        }

        [TestMethod]
        public void ReturnNull()
        {
            var sut = new NodeCursor(_topFolder, 1, CreateRequestContext());

            var result = sut.CurrentNode;
            Assert.IsNull(result);
        }

        private RequestContext CreateRequestContext()
        {
            var requestContext = new RequestContext
            {
                Direction = Direction.Forward,
                State = new RequestState(),
                NodeService = _nodeService,
                Respondent = new Respondents.Respondent { Id = 0 }
            };
            return requestContext;
        }
    }
}