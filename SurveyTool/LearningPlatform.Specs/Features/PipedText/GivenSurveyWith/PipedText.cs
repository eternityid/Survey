using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.PipedText.GivenSurveyWith
{
    [Binding]
    public class PipedText
    {
        private readonly PageContext _pageContext;

        public PipedText(PageContext pageContext)
        {
            _pageContext = pageContext;
        }

        [Given(@"I have survey with piped text")]
        public void GivenIHaveSurveyWithPipedText()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();
            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.OpenEndedShortTextQuestion("name")),
                    create.Page(
                        create.Information("info", description: "Hello {{questions.name}}"))));
            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
    }
}