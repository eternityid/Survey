using System;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyExecution.Request;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.NodeCursorTests
{
    [TestClass]
    public class NodeCursor_MoveToFolder_Should
    {
        private Folder _topFolder;
        private Folder _folder1;
        private Folder _folder2;
        private Folder _child1;
        private Folder _child2;
        private Folder _child3;

        [TestInitialize]
        public void Init()
        {
            _topFolder = new Folder("topFolder");
            _folder1 = new Folder("folder1");
            _child1 = new Folder("child1");
            _folder1.ChildNodes.Add(_child1);
            _folder2 = new Folder("folder2");
            _child2 = new Folder("child2");
            _folder2.ChildNodes.Add(_child2);
            _child3 = new Folder("child3");
            _folder2.ChildNodes.Add(_child3);


            _topFolder.ChildNodes.Add(_folder1);
            _topFolder.ChildNodes.Add(_folder2);
        }

        [TestMethod]
        public void MakeCurrentNodeBeChild1DirectionForward()
        {
            const int index = 0;
            NodeCursor sut = CreateSut(index, Direction.Forward);

            sut.MoveToFolder(_folder1);
            Assert.AreEqual(_child1, sut.CurrentNode);
        }


        [TestMethod]
        public void MakeCurrentNodeBeChild2DirectionForward()
        {
            const int index = 0;
            NodeCursor sut = CreateSut(index, Direction.Forward);

            sut.MoveToFolder(_folder2);
            Assert.AreEqual(_child2, sut.CurrentNode);
        }


        [TestMethod]
        public void MakeCurrentNodeBeChild1DirectionBack()
        {
            const int index = 0;
            NodeCursor sut = CreateSut(index, Direction.Back);

            sut.MoveToFolder(_folder2);
            Assert.AreEqual(_child3, sut.CurrentNode);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void ThrowArgumentNullException()
        {
            const int index = 0;
            NodeCursor sut = CreateSut(index, Direction.Forward);

            sut.MoveToFolder(null);

        }

        private NodeCursor CreateSut(int index, Direction direction)
        {
            var requestContext = new RequestContext
            {
                Direction = direction,
                State = new RequestState(),
                NodeService = new NodeService(null),
                Respondent = new Respondents.Respondent { Id = 0}
            };
            return new NodeCursor(_topFolder, index, requestContext);
        }
    }
}