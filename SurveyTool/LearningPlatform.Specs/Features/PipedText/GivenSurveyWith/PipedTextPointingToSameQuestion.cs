using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.PipedText.GivenSurveyWith
{
    [Binding]
    public class PipedTextPointingToSameQuestion
    {
        private readonly PageContext _pageContext;

        public PipedTextPointingToSameQuestion(PageContext pageContext)
        {
            _pageContext = pageContext;
        }

        [Given(@"I have survey with piped text pointing to the same question")]
        public void GivenIHaveSurveyWithPipedTextPointingToItself()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();
            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.OpenEndedShortTextQuestion("name", description: "Hello {{questions.name}}")),
                    create.Page(
                        create.Information("info", description: "Finished"))));
            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
    }
}