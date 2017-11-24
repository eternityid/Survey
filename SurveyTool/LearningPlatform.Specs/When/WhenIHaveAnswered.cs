using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.SurveyExecution.Questions;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.When
{
    [Binding]
    public class WhenIHaveAnswered
    {
        private readonly InstanceContext _instances;
        private readonly PageContext _pageContext;

        public WhenIHaveAnswered(InstanceContext instances, PageContext pageContext)
        {
            _instances = instances;
            _pageContext = pageContext;
        }

        [When(@"I have answered (aliases .*) on the (.*) question")]
        public void WhenIHaveAnsweredMaleOnTheGenderQuestion(List<string> codes, string questionId)
        {
            Question question = _pageContext.AssertQuestionOnPage(questionId);
            question.Answer = codes.ToDictionary(item => item, item => true);
        }

        [When(@"I have answered value (.*) on the (.*) question")]
        public void WhenIHaveAnsweredMaleOnTheGenderQuestion(string answerString, string questionId)
        {
            Question question = _pageContext.AssertQuestionOnPage(questionId);
            question.Answer = answerString;
        }


    }
}