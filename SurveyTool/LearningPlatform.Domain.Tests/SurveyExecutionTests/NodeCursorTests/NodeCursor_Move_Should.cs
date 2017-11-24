using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyExecution.Request;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.NodeCursorTests
{
    [TestClass]
    public class NodeCursor_Move_Should
    {
        private Folder _topFolder;
        private Folder _child1;
        private Folder _child2;
        private INodeService _nodeService;

        [TestInitialize]
        public void Init()
        {
            _topFolder = new Folder("topFolder") {Id = "1"};
            _child1 = new Folder("child") { Id = "2" };
            _topFolder.ChildNodes.Add(_child1);
            _child2 = new Folder("child2") { Id = "3" };
            _topFolder.ChildNodes.Add(_child2);
            _nodeService = new NodeService(new Survey { TopFolder = _topFolder });
        }

        [TestMethod]
        public void MakeCurrentNodeBeNullDirectionForward()
        {
            const int index = 1;
            var sut = CreateSut(index, Direction.Forward);
            sut.Move();
            Assert.IsNull(sut.CurrentNode);
        }


        [TestMethod]
        public void MakeCurrentNodeBeChild2DirectionForward()
        {
            const int index = 0;
            var sut = CreateSut(index, Direction.Forward);

            sut.Move();
            Assert.AreEqual(_child2, sut.CurrentNode);
        }

        [TestMethod]
        public void MakeCurrentNodeBeNullDirectionBack()
        {
            const int index = 0;
            var sut = CreateSut(index, Direction.Back);

            sut.Move();
            Assert.IsNull(sut.CurrentNode);
        }


        [TestMethod]
        public void MakeCurrentNodeBeChild1DirectionBack()
        {
            const int index = 1;
            var sut = CreateSut(index, Direction.Back);
            sut.Move();
            Assert.AreEqual(_child1, sut.CurrentNode);
        }

        private NodeCursor CreateSut(int index, Direction direction)
        {
            var requestContext =  new RequestContext
            {
                Direction = direction,
                State = new RequestState(),
                NodeService = _nodeService,
                Respondent = new Respondents.Respondent { Id = 0 }
            };

            var sut = new NodeCursor(_topFolder, index, requestContext);
            return sut;
        }
    }
}