using LearningPlatform.Domain.SurveyExecution;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Then
{
    [Binding]
    public class ThenTheNavigationButtonShould
    {        
        private readonly PageContext _pageContext;

        public ThenTheNavigationButtonShould(PageContext pageContext)
        {
            _pageContext = pageContext;
        }

        [Then(@"navigation button is forward only")]
        public void ThenNavigationButtonIsForwardOnly()
        {
            Assert.AreEqual(NavigationButtons.Next, _pageContext.Page.NavigationButtons);
        }


        [Then(@"navigation button is back only")]
        public void ThenNavigationButtonIsBackOnly()
        {
            Assert.AreEqual(NavigationButtons.Previous, _pageContext.Page.NavigationButtons);
        }

        [Then(@"navigation buttons are both directions")]
        public void ThenNavigationButtonIsBothDirections()
        {
            Assert.AreEqual(NavigationButtons.PreviousAndNext, _pageContext.Page.NavigationButtons);
        }

        [Then(@"navigation button is not displayed")]
        public void ThenNavigationButtonIsNotDisplayed()
        {
            Assert.AreEqual(NavigationButtons.None, _pageContext.Page.NavigationButtons);
        }
    }
}