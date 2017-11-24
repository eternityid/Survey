using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Then
{
    [Binding]
    public class ProgressInSurveyWithConditionSteps
    {
        private readonly InstanceContext _instanceContext;
        private readonly PageContext _pageContext;

        public ProgressInSurveyWithConditionSteps(InstanceContext instanceContext, PageContext pageContext)
        {
            _instanceContext = instanceContext;
            _pageContext = pageContext;
        }

        [Then(@"the progress should be (.*)")]
        public void ThenProgressShouldBe(int progress)
        {
            Assert.AreEqual(progress, _pageContext.Page.Progress, "Expected progress did not match");
        }
    }
}
