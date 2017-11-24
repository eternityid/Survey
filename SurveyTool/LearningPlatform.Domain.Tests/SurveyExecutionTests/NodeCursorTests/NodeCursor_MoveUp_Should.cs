using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyExecution.Request;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.NodeCursorTests
{
    [TestClass]
    public class NodeCursor_MoveUp_Should
    {
        private Folder _topFolder;
        private Folder _child;
        private INodeService _nodeService;

        [TestInitialize]
        public void Init()
        {
            _topFolder = new Folder("topFolder") {Id = "1"};
            _child = new Folder("child") {Id = "2"};
            _topFolder.ChildNodes.Add(_child);
            _nodeService = new NodeService(new Survey { TopFolder = _topFolder });
        }

        [TestMethod]
        public void SetParentFolderToNull()
        {
            var sut = new NodeCursor(_topFolder, 0, CreateRequestContext());

            sut.MoveUp();
            Assert.IsNull(sut.ParentFolder);
        }


        [TestMethod]
        public void SetParentFolderToTopFolder()
        {
            var sut = new NodeCursor(_child, 0, CreateRequestContext());

            sut.MoveUp();
            Assert.AreEqual(_topFolder, sut.ParentFolder);
        }

        [TestMethod]
        public void SetParentFolderToTopFolderWhenCondition()
        {
            var trueFolder = new Folder("trueFolder") {Id = "1"};
            var condition = new Condition("condition", "", trueFolder, null) {Id = "2"};
            _topFolder.ChildNodes.Add(condition);
            _nodeService = new NodeService(new Survey{TopFolder = _topFolder});

            var sut = new NodeCursor(trueFolder, 0, CreateRequestContext());

            sut.MoveUp();
            Assert.AreEqual(_topFolder, sut.ParentFolder);
        }

        private RequestContext CreateRequestContext()
        {
            return new RequestContext
            {
                Direction = Direction.Forward,
                State = new RequestState(),
                Respondent = new Respondents.Respondent { Id = 0 },
                NodeService = _nodeService
            };
        }
    }
}