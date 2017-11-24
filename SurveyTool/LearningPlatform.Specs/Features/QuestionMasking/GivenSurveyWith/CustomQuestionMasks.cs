using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.QuestionMasking.GivenSurveyWith
{
    [Binding]
    public class CustomQuestionMasks
    {
        private readonly PageContext _pageContext;

        public CustomQuestionMasks(PageContext pageContext)
        {
            _pageContext = pageContext;
        }

        [Given(@"I have a survey with question q1 with custom masks (.*) and q2")]
        public void GivenSimpleQuestionMask(string customQuestionMask)
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();
            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.MultipleSelectionQuestion("q1", "q1", "q1", q =>
                        {
                            q.QuestionMask = customQuestionMask;
                        },
                            create.Option("1"),
                            create.Option("2"),
                            create.Option("3")),
                        create.SingleSelectionQuestion("q2", "q2", "q2", null,
                            create.Option("1"),
                            create.Option("2"),
                            create.Option("3")))));

            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
    }
}