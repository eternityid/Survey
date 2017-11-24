using System.Collections.Generic;
using Autofac.Extras.Moq;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.RepositoryContracts;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.QuestionServiceTests
{
    [TestClass]
    public class QuestionService_SaveQuestion_Should
    {
        [TestMethod]
        public void ReturnMultipleSelectionQuestionWith0Answer()
        {
            using (var autoMock = AutoMock.GetLoose())
            { 
                var survey = autoMock.CreateSurveyWithMultipleSelectionQuestion(OrderType.InOrder);
                autoMock.ProvideRequestContext(survey, 10);

                var multipleSelectionQuestion = new MultipleSelectionQuestion { Alias = TestSurveyFactory.Question1Id };
                autoMock.Mock<IResponseRowRepository>().Setup(o => o.GetRows(new List<Question> { multipleSelectionQuestion }, 10, TestSurveyFactory.SurveyId))
                    .Returns(new List<ResponseRow>());
                autoMock.Mock<IQuestionFactory>().Setup(o => o.CreateQuestion(TestSurveyFactory.Question1Id)).Returns(multipleSelectionQuestion);

                var sut = autoMock.Create<QuestionService>();
                sut.SaveQuestion(multipleSelectionQuestion);

                autoMock.Mock<IResponseRowFactory>().Verify(factory => factory.CreateResponseRows(TestSurveyFactory.SurveyId, 10, It.IsAny<LoopState>(), new List<Question> {multipleSelectionQuestion}));
                autoMock.Mock<IResponseRowRepository>().Verify(repository=>repository.Update(It.IsAny<List<ResponseRow>>()));
            }
        }
    }
}