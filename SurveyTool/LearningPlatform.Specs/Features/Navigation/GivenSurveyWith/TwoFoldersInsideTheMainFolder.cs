using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.Navigation.GivenSurveyWith
{
    [Binding]
    public class TwoFoldersInsideTheMainFolder
    {
        private readonly PageContext _pageContext;

        public TwoFoldersInsideTheMainFolder(PageContext pageContext)
        {
            _pageContext = pageContext;
        }

        [Given(@"I have a survey with two folders inside the main folder")]
        public void ASurveyWithTwoFoldersInsideTheMainFolder()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();
            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Folder("folder2",
                        create.Page(
                            create.OpenEndedShortTextQuestion("q1", "q1", "q1"))),
                    create.Folder("folder3",
                        create.Page(
                            create.OpenEndedShortTextQuestion("q2", "q2", "q2"))),
                    create.Page(
                        create.OpenEndedShortTextQuestion("q3", "q3", "q3"))));

            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
 
    }
}