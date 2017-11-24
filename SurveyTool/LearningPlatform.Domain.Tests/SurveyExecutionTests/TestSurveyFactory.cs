using Autofac.Extras.Moq;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution.Request;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests
{
    public static class TestSurveyFactory
    {
        public const string SurveyId = "1";
        public const string Question1Id = "question1";
        public const string Question2Id = "question2";


        public static Survey CreateSurvey(this AutoMock autoMock)
        {
            var create = autoMock.Create<SurveyDesign.SurveyDesign.Factory>().Invoke(SurveyId);
            return create.Survey(
                create.Folder("topFolder",
                    create.Page()));
        }

        public static Survey CreateSurveyWithOpenEndedQuestion(this AutoMock autoMock)
        {
            var create = autoMock.Create<SurveyDesign.SurveyDesign.Factory>().Invoke(SurveyId);

            return create.Survey(
                create.Folder("topFolder",
                    create.Page(create.OpenEndedShortTextQuestion(Question1Id))));
        }

        public static Survey CreateSurveyWithMultipleSelectionQuestion(this AutoMock autoMock, OrderType orderType)
        {
            var create = autoMock.Create<SurveyDesign.SurveyDesign.Factory>().Invoke(SurveyId);
            return create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.MultipleSelectionQuestion(Question1Id, (string)null, null, question => question.OrderType = orderType,
                            create.Option("1"),
                            create.Option("2"),
                            create.Option("3")))));
        }

        public static Survey CreateSurveyWithTwoFolders(this AutoMock autoMock, OrderType orderType)
        {
            var create = autoMock.Create<SurveyDesign.SurveyDesign.Factory>().Invoke(SurveyId);
            return create.Survey(
                create.Folder("topFolder",
                    create.Folder("Folder1",
                        create.Page(
                            create.OpenEndedShortTextQuestion(Question1Id))),
                    create.Folder("Folder2",
                        create.Page(
                            create.OpenEndedShortTextQuestion(Question2Id)))));
        }

        public static void ProvideRequestContext(this AutoMock autoMock, Survey survey, long respondentId, INodeService nodeService = null)
        {
            var requestContext = new RequestContext
            {
                Survey = survey,
                NodeService = nodeService ?? autoMock.Create<INodeService>(),
                State = new RequestState(),
                Respondent = new Respondent { Id = respondentId, SurveyId = survey.Id, Language = "en" }
            };
            autoMock.Provide<IRequestContext>(requestContext);
        }

    }
}