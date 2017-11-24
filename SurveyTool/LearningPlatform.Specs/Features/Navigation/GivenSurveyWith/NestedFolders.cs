using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.Navigation.GivenSurveyWith
{
    [Binding]
    public class NestedFolders
    {
        private readonly PageContext _pageContext;

        public NestedFolders(PageContext pageContext)
        {
            _pageContext = pageContext;
        }

        [Given(@"I have a survey with nested folders")]
        public void ASurveyWithNestedFolders()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();
            Survey survey = create.Survey(
                create.Folder("folder",
                    create.Folder("folder2",
                        create.Page(
                            create.OpenEndedShortTextQuestion("q1", "q1", "q1")),
                        create.Page(
                            create.OpenEndedShortTextQuestion("q2", "q2", "q2"))),
                    create.Page(
                        create.OpenEndedShortTextQuestion("q3", "q3", "q3"))));

            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
 
    }
}