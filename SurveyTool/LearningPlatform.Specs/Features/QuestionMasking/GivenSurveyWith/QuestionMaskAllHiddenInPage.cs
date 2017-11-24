using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.QuestionMasking.GivenSurveyWith
{
    [Binding]
    public class QuestionMaskAllHiddenInPage
    {
        private readonly PageContext _pageContext;

        public QuestionMaskAllHiddenInPage(PageContext pageContext)
        {
            _pageContext = pageContext;
        }

        [Given(@"I have a survey with question masks where all questions in page is hidden")]
        public void GivenASurvey()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();
            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.MultipleSelectionQuestion("q1", "q1", "q1", q =>
                            {
                                q.QuestionMask = "false";
                            },
                            create.Option("1"),
                            create.Option("2"),
                            create.Option("3")),
                        create.MultipleSelectionQuestion("q2", "q2", "q2", q =>
                            {
                                q.QuestionMask = "false";
                            },
                            create.Option("1"),
                            create.Option("2"),
                            create.Option("3"))),
                    create.Page(
                        create.SingleSelectionQuestion("q3", "q3", "q3", null,
                            create.Option("1"),
                            create.Option("2"),
                            create.Option("3"))),
                    create.Page(
                        create.Information("Thank you"))));

            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
    }
}