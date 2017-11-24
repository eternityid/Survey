using System.Collections.Generic;
using System.Linq;
using Autofac.Extras.Moq;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Request;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using LearningPlatform.Domain.SurveyDesign.Pages;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.SurveyRunnerTests
{
    [TestClass]
    public class PageExecutor_Should
    {
        private Survey _survey;
        private AutoMock _autoMock;

        const long RespondentId = 1;

        [TestInitialize]
        public void Init()
        {
            _autoMock = AutoMock.GetLoose();
            _autoMock.Mock<INodeExecutor>().Setup(nodeExecutor => nodeExecutor.Execute(It.IsAny<Folder>(), It.IsAny<NodeCursor>()))
                .Callback((Node folder, NodeCursor nodeCursor) => nodeCursor.MoveToFolder((Folder) folder));
            _autoMock.Mock<IQuestionService>().Setup(a => a.GetQuestionsWithAnswers(It.IsAny<List<string>>()))
                .Returns(new List<Question>{new Information()});
            _survey = _autoMock.CreateSurveyWithTwoFolders(OrderType.InOrder);
            _autoMock.ProvideRequestContext(_survey, RespondentId, new NodeService(_survey));
        }

        [TestMethod]
        public void ReturnFirstPage()
        {
            var sut = _autoMock.Create<PageExecutor>();
            PageDefinition result = sut.GotoFirstPage();
            CollectionAssert.AreEqual(result.QuestionAliases.ToList(), new[]{TestSurveyFactory.Question1Id});
        }

        [TestMethod]
        public void ReturnLastPage()
        {
            var sut = _autoMock.Create<PageExecutor>();
            PageDefinition result = sut.GotoLastPage();
            CollectionAssert.AreEqual(result.QuestionAliases.ToList(), new[] {TestSurveyFactory.Question2Id});
        }

        [TestMethod]
        public void ReturnNullForNextPage()
        {
            var sut = _autoMock.Create<PageExecutor>();
            PageDefinition result = sut.MoveToNextPage("3");
            Assert.IsNull(result);
        }

        [TestMethod]
        public void ReturnNullForPreviousPage()
        {
            var sut = _autoMock.Create<PageExecutor>();
            PageDefinition result = sut.MoveToPreviousPage("1");
            Assert.IsNull(result);
        }

        [TestMethod]
        public void ReturnTrueForHasNext()
        {
            var sut = _autoMock.Create<PageExecutor>();
            bool result = sut.PeekNext("1") !=null;
            Assert.IsTrue(result);
        }


        [TestMethod]
        public void ReturnFalseForHasNext()
        {
            var sut = _autoMock.Create<PageExecutor>();
            bool result = sut.PeekNext("3") !=null;
            Assert.IsFalse(result);
        }

        [TestMethod]
        public void ReturnFalseForHasPrevious()
        {
            var sut = _autoMock.Create<PageExecutor>();
            bool result = sut.PeekPrevious("1") !=null;
            Assert.IsFalse(result);
        }


        [TestMethod]
        public void InvokeNodeExecutor()
        {
            var sut = _autoMock.Create<PageExecutor>();
            sut.MoveToNextPage("1");
            _autoMock.Mock<INodeExecutor>().Verify(nodeExecutor => nodeExecutor.Execute(It.IsAny<Folder>(), It.IsAny<NodeCursor>()), Times.Once);
        }

        [TestMethod]
        public void ReturnFromGotoFolder()
        {
            var requestContext = _autoMock.Create<IRequestContext>();
            requestContext.State.GotoStack.Items.Push(requestContext.NodeService.GetPageDefinition("1").Id);

            var sut = _autoMock.Create<PageExecutor>();
            var result = sut.MoveToNextPage("1");
            Assert.AreEqual(TestSurveyFactory.Question1Id, result.QuestionAliases.First());
        }

        

    }
}