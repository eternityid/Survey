using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Then
{
    [Binding]
    public class ThenSteps
    {
        private readonly InstanceContext _instanceContext;
        private readonly PageContext _pageContext;

        public ThenSteps(PageContext pageContext, InstanceContext instanceContext)
        {
            _pageContext = pageContext;
            _instanceContext = instanceContext;
        }



        [Then(@"the page should have questions with (ids .*)")]
        public void ThenThePageShouldHaveQuestion(List<string> questionIds)
        {
            CollectionAssert.AreEqual(questionIds, _pageContext.Page.Questions.Select(q => q.Alias).ToList());
        }


        [Then(@"an error message (.*) is shown")]
        public void ThenAnErrorMessageQuestionNameIsRequiredIsShown(string errorMessage)
        {
            Assert.AreEqual(1, _pageContext.Page.Errors.Count);
            Assert.AreEqual(errorMessage, _pageContext.Page.Errors[0].Message);
        }

        [Then(@"no error message is shown")]
        public void ThenNoErrorMessageIsShown()
        {
            Assert.AreEqual(0, _pageContext.Page.Errors.Count);
        }

    }
}