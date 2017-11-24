using System.Collections.Generic;
using Autofac.Extras.Moq;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution.Options;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.RepositoryContracts;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using LearningPlatform.TestFramework;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.QuestionServiceTests
{
    [TestClass]
    public class QuestionService_GetQuestion_Should
    {
        private AutoMock _autoMock;

        [TestInitialize]
        public void Init()
        {
            _autoMock = AutoMock.GetLoose();
            var survey = _autoMock.CreateSurveyWithMultipleSelectionQuestion(OrderType.InOrder);
            _autoMock.ProvideRequestContext(survey, 10);
        }

        [TestMethod]
        public void ReturnMultipleSelectionQuestionWith0Answer()
        {
            var multipleSelectionQuestion = new MultipleSelectionQuestion { Alias = TestSurveyFactory.Question1Id, Options = new List<Option>()};
            _autoMock.Mock<IResponseRowRepository>().Setup(o => o.GetRows(new List<Question> { multipleSelectionQuestion }, 10, TestSurveyFactory.SurveyId)).Returns(new List<ResponseRow> ());
            _autoMock.Mock<IQuestionFactory>().Setup(o => o.CreateQuestion(TestSurveyFactory.Question1Id)).Returns(multipleSelectionQuestion);
            QuestionService sut = _autoMock.Create<QuestionService>();
            var result = sut.GetQuestion(TestSurveyFactory.Question1Id) as MultipleSelectionQuestion;

            Assert.IsNotNull(result);
            Assert.AreEqual(0, result.MultipleSelectionAnswer.Count);
        }

        
        [TestMethod]
        public void ReturnMultipleSelectionQuestionWith1Answer()
        {
            var multipleSelectionQuestion = new MultipleSelectionQuestion { Alias = TestSurveyFactory.Question1Id, Options = new Option[0]};
            var responseRow = new ResponseRow { QuestionName = TestSurveyFactory.Question1Id, AnswerType = AnswerType.Multi, Alias = "1", IntegerAnswer = 1, LoopState = new LoopState()};

            _autoMock.Mock<IResponseRowRepository>().Setup(o => o.GetRows(new List<Question> { multipleSelectionQuestion }, 10, TestSurveyFactory.SurveyId)).Returns(new List<ResponseRow> { responseRow });
            _autoMock.Mock<IQuestionFactory>().Setup(o => o.CreateQuestion(TestSurveyFactory.Question1Id)).Returns(multipleSelectionQuestion);
            var sut = _autoMock.Create<QuestionService>();
            var result = sut.GetQuestion(TestSurveyFactory.Question1Id) as MultipleSelectionQuestion;

            Assert.IsNotNull(result);
            DictionaryAssert.AreEqual(new Dictionary<string, bool> { { "1", true } }, result.MultipleSelectionAnswer.Items);
        }

        [TestMethod]
        public void ReturnMultipleSelectionQuestionWith3Answers()
        {
            var multipleSelectionQuestion = new MultipleSelectionQuestion { Alias = TestSurveyFactory.Question1Id, Options = new Option[0]};
            var row1 = new ResponseRow { QuestionName = TestSurveyFactory.Question1Id, AnswerType = AnswerType.Multi, Alias = "1", IntegerAnswer = 1, LoopState = new LoopState()};
            var row2 = new ResponseRow { QuestionName = TestSurveyFactory.Question1Id, AnswerType = AnswerType.Multi, Alias = "2", IntegerAnswer = 0, LoopState = new LoopState()};
            var row3 = new ResponseRow { QuestionName = TestSurveyFactory.Question1Id, AnswerType = AnswerType.Multi, Alias = "3", IntegerAnswer = 1, LoopState = new LoopState()};

            _autoMock.Mock<IResponseRowRepository>().Setup(o => o.GetRows(new List<Question> { multipleSelectionQuestion }, 10, TestSurveyFactory.SurveyId)).Returns(new List<ResponseRow> { row1, row2, row3 });
            _autoMock.Mock<IQuestionFactory>().Setup(o => o.CreateQuestion(TestSurveyFactory.Question1Id)).Returns(multipleSelectionQuestion);

            QuestionService sut = _autoMock.Create<QuestionService>();
            var result = sut.GetQuestion(TestSurveyFactory.Question1Id) as MultipleSelectionQuestion;

            Assert.IsNotNull(result);
            DictionaryAssert.AreEqual(new Dictionary<string, bool> {{"1", true}, {"2", false}, {"3", true}}, result.MultipleSelectionAnswer.Items);
        }

        [TestMethod]
        public void ReturnFromCache()
        {
            var multipleSelectionQuestion = new MultipleSelectionQuestion { Alias = TestSurveyFactory.Question1Id, Options = new Option[0]};
            var row1 = new ResponseRow { QuestionName = TestSurveyFactory.Question1Id, AnswerType = AnswerType.Multi, Alias = "1", TextAnswer = "1", LoopState = new LoopState()};

            _autoMock.Mock<IResponseRowRepository>().Setup(o => o.GetRows(new List<Question> { multipleSelectionQuestion }, 10, TestSurveyFactory.SurveyId)).Returns(new List<ResponseRow> {row1});
            _autoMock.Mock<IQuestionFactory>().Setup(o => o.CreateQuestion(TestSurveyFactory.Question1Id)).Returns(multipleSelectionQuestion);

            QuestionService sut = _autoMock.Create<QuestionService>();
            sut.GetQuestion(TestSurveyFactory.Question1Id);
            _autoMock.Mock<IQuestionFactory>().ResetCalls();
            sut.GetQuestion(TestSurveyFactory.Question1Id);
            _autoMock.Mock<IResponseRowRepository>().Verify(
                p => p.GetRows(It.IsAny<List<Question>>(), It.IsAny<int>(), It.IsAny<string>()), Times.Never);
        }


        [TestMethod]
        public void ReturnOneFromCacheAndOneFromRepository()
        {
            var multipleSelectionQuestion = new MultipleSelectionQuestion { Alias = TestSurveyFactory.Question1Id, Options = new Option[0]};
            var row1 = new ResponseRow { QuestionName = TestSurveyFactory.Question1Id, AnswerType = AnswerType.Multi, Alias = "1", TextAnswer = "1", LoopState = new LoopState()};
            _autoMock.Mock<IResponseRowRepository>().Setup(o => o.GetRows(new List<Question> { multipleSelectionQuestion }, 10, TestSurveyFactory.SurveyId)).Returns(new List<ResponseRow> { row1 });
            _autoMock.Mock<IQuestionFactory>().Setup(o => o.CreateQuestion(TestSurveyFactory.Question1Id)).Returns(multipleSelectionQuestion);

            QuestionService sut = _autoMock.Create<QuestionService>();
            sut.GetQuestion(TestSurveyFactory.Question1Id);
            _autoMock.Mock<IQuestionFactory>().Setup(o => o.CreateQuestion("q100")).Returns(new OpenEndedShortTextQuestion {Alias = "q100"});
            _autoMock.Mock<IResponseRowRepository>().ResetCalls();
            
            sut.GetQuestionsWithAnswers(new List<string> { TestSurveyFactory.Question1Id, "q100" });
            _autoMock.Mock<IResponseRowRepository>().Verify(
                p => p.GetRows(It.IsAny<List<Question>>(), It.IsAny<int>(), It.IsAny<string>()), Times.Never);
        }
    }
}