using LearningPlatform.Domain.SurveyExecution;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.When
{
    [Binding]
    public class WhenINavigate
    {
        private readonly InstanceContext _instances;
        private readonly PageContext _pageContext;
        private readonly SurveyContext _surveyContext;

        public WhenINavigate(InstanceContext instances, PageContext pageContext, SurveyContext surveyContext)
        {
            _instances = instances;
            _pageContext = pageContext;
            _surveyContext = surveyContext;
        }


        [When(@"I press next")]
        public void WhenIPressForward()
        {
            _pageContext.Page = _instances.SurveyAppService.Navigate(_surveyContext.SurveyId, false, Direction.Forward, _instances.PageService.GetNameValueCollection(_pageContext.Page));
        }


        [When(@"I press back")]
        public void WhenIPressBack()
        {
            _pageContext.Page = _instances.SurveyAppService.Navigate(_surveyContext.SurveyId, false, Direction.Back, _instances.PageService.GetNameValueCollection(_pageContext.Page));
        }
 
    }
}