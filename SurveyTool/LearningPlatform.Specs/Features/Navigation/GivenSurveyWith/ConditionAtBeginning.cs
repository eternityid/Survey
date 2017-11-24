using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.Navigation.GivenSurveyWith
{
    [Binding]
    public class ConditionAtBeginning
    {
        private readonly PageContext _pageContext;

        public ConditionAtBeginning(PageContext pageContext)
        {
            _pageContext = pageContext;
        }


        [Given(@"I have a survey with a condition as the first element")]
        public void SurveyWithCondition()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();
            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Condition("condition", "questions.age.answer===5",
                        create.Folder("trueFolder",
                            create.Page(
                                create.OpenEndedShortTextQuestion("question1", "Heading1", "Text1")))),
                    create.Page(
                        create.NumericQuestion("age", "Age", "Numeric"),
                        create.SingleSelectionQuestion("gender", "Gender", "Please state your gender", q => q.OrderType = OrderType.InOrder,
                            create.Option("1", text: "male"),
                            create.Option("2", text: "female"))),
                    create.Page(
                        create.Information("information", "Information", "You have completed the survey."))));

            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
    }
}