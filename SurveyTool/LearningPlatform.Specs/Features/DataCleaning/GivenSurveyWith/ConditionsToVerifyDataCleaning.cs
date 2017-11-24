using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.DataCleaning.GivenSurveyWith
{
    [Binding]
    public class ConditionsToVerifyDataCleaning
    {
        private readonly PageContext _pageContext;

        public ConditionsToVerifyDataCleaning(PageContext pageContext)
        {
            _pageContext = pageContext;
        }

        [Given(@"I have a survey with nested conditions")]
        public void GivenIHaveASurveyWithNestedConditions()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();

            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.SingleSelectionQuestion("gender", "Gender", "Please state your gender", q => q.OrderType = OrderType.InOrder,
                            create.Option("1", text: "male"),
                            create.Option("2", text: "female"))),
                    create.Condition("condition", "questions.gender.answer=='1'",
                        create.Folder("trueFolder",
                            create.Page(
                                create.OpenEndedShortTextQuestion("q1", "Heading1", "Text1")),
                            create.Folder("innerFolder",
                                create.Page(
                                    create.OpenEndedShortTextQuestion("q2"),
                                    create.OpenEndedShortTextQuestion("q3"))),
                            create.Condition("another condition", "true",
                                create.Folder("true1",
                                    create.Page(
                                        create.OpenEndedShortTextQuestion("q4"))))),
                        create.Folder("falseFolder",
                            create.Page(
                                create.OpenEndedShortTextQuestion("femaleQuestion", "Heading2", "Text2")))),
                    create.Page(
                        create.Information("information", "Information", "You have completed the survey."))));


            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
    }
}