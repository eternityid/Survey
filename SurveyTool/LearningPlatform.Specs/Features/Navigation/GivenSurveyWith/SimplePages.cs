using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.Navigation.GivenSurveyWith
{
    [Binding]
    public class SimplePages
    {
        private readonly PageContext _pageContext;

        public SimplePages(PageContext pageContext)
        {
            _pageContext = pageContext;
        }

        [Given(@"I have a survey with single question ""gender"" and number question ""age""")]
        public void GivenIHaveASimpleSurvey()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();
            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.SingleSelectionQuestion("gender", (string)null, null, q => q.OrderType = OrderType.InOrder,
                            create.Option("1", text: "male"),
                            create.Option("2", text: "female"))),
                    create.Page(
                        create.NumericQuestion("age")),
                    create.Page(
                        create.Information("information")),
                    create.Page(p=>p.NavigationButtonSettings = NavigationButtonSettings.None,
                        create.Information("Completed"))
                    ));

            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
    }
}