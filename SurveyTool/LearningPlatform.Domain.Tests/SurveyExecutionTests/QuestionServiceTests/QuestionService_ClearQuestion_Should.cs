using System.Collections.Generic;
using Autofac.Extras.Moq;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.RepositoryContracts;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.QuestionServiceTests
{
    [TestClass]
    public class QuestionService_ClearQuestion_Should
    {

        [TestMethod]
        public void CallDeleteOnRepository()
        {
            const int respondentId = 10;

            using (var autoMock = AutoMock.GetLoose())
            {
                var survey = autoMock.CreateSurveyWithMultipleSelectionQuestion(OrderType.InOrder);
                autoMock.ProvideRequestContext(survey, respondentId);

                var multipleSelectionQuestion = new MultipleSelectionQuestion {Alias = TestSurveyFactory.Question1Id};
                var responseRowRespositorMock = autoMock.Mock<IResponseRowRepository>();
                responseRowRespositorMock.Setup(
                    o => o.GetRows(new List<Question> {multipleSelectionQuestion}, respondentId, TestSurveyFactory.SurveyId))
                    .Returns(new List<ResponseRow>());
                autoMock.Mock<IQuestionFactory>().Setup(
                    o => o.CreateQuestion(TestSurveyFactory.Question1Id))
                    .Returns(multipleSelectionQuestion);

                QuestionService sut = autoMock.Create<QuestionService>();
                var questionIds = new[] {TestSurveyFactory.Question1Id};
                sut.CleanQuestions(questionIds);

                responseRowRespositorMock.Verify(
                    repository => repository.Delete(questionIds, respondentId, TestSurveyFactory.SurveyId));
            }
        }
    }
}