using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.Scripting.GivenSurveyWith
{
    [Binding]
    public class ScriptNode
    {
        private readonly PageContext _pageContext;

        public ScriptNode(PageContext pageContext)
        {
            _pageContext = pageContext;
        }


        [Given(@"I have a survey with a script block with the following code:")]
        public void GivenIHaveASurveyWithAScriptBlockWithTheFollowingCode(string scriptCode)
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();
            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Script("script1", scriptCode),
                    create.Page(
                        create.OpenEndedShortTextQuestion("q1"))));

            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
    }
}