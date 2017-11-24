using System;
using System.Web;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.When
{
    [Binding]
    public class ResumeInLoopSteps
    {
        private readonly InstanceContext _instances;
        private readonly PageContext _pageContext;

        public ResumeInLoopSteps(InstanceContext instances, PageContext pageContext)
        {
            _instances = instances;
            _pageContext = pageContext;
        }

        [When(@"I resume survey")]
        public void WhenIResumeSurvey()
        {
            _pageContext.ResumeSurvey();
        }
    }
}
