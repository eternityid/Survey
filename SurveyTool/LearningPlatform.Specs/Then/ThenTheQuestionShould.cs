using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.SurveyExecution.Options;
using LearningPlatform.Domain.SurveyExecution.Questions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Then
{
    [Binding]
    public class ThenTheQuestionShould
    {
        private readonly InstanceContext _instanceContext;
        private readonly PageContext _pageContext;

        public ThenTheQuestionShould(PageContext pageContext, InstanceContext instanceContext)
        {
            _pageContext = pageContext;
            _instanceContext = instanceContext;
        }

        [Then(@"the question should be (.*)")]
        public void ThenTheQuestionShouldBe(string questionId)
        {
            Question question = _pageContext.AssertQuestionOnPage(questionId);
            Assert.IsNotNull(question);
        }



        [Then(@"the question (.*) should be of type (.*)")]
        public void ThenTheQuestionShouldBeOfType(string questionId, string type)
        {
            Question question = _pageContext.AssertQuestionOnPage(questionId);
            Assert.AreEqual(type, question.GetType().Name);
        }

        [Then(@"the question (.*) should have options with (aliases .*)")]
        public void ThenTheQuestionQuestionShouldHaveOptions(string questionId, List<string> expected)
        {
            var question = _pageContext.AssertQuestionOnPage(questionId) as IOptions;
            Assert.IsNotNull(question);

            List<string> actual = question.Options.Select(a => a.Alias).ToList();
            CollectionAssert.AreEqual(expected, actual);
        }


        [Then(@"the question (.*) should have the text (.*)")]
        public void ThenTheQuestionQuestionShouldHaveText(string questionId, string text)
        {
            if (text == "''") text = "";
            Question question = _pageContext.AssertQuestionOnPage(questionId);
            string result = question.Description;
            Assert.AreEqual(text, result);
        }

        [Then(@"the question (.*) should have answer (.*)")]
        public void AndQuestionShouldBe(string questionId, string answer)
        {
            Question question = _pageContext.AssertQuestionOnPage(questionId);
            var singleQuestion = question as SingleSelectionQuestion;
            if (singleQuestion != null)
            {
                Assert.AreEqual(answer, question.Answer);
            }
            else
            {
                Assert.AreEqual(answer, question.Answer);
            }
        }


        //TODO: Consider a version for multi question
        [Then(@"the question (.*) should have value (.*) in the database")]
        public void ThenTheQuestionShouldBeInTheDatabase(string questionId, object value)
        {
            ThenTheQuestionsShouldBeInTheDatabase(new List<string>() { questionId }, value);
        }


        [Then(@"the question (.*) should have (aliases .*) in the database")]
        public void ThenTheQuestionShouldHaveCodesInTheDatabase(string questionId, List<string> codes)
        {
            var question = _instanceContext.QuestionService.GetQuestion(questionId) as MultipleSelectionQuestion;
            Assert.IsNotNull(question, "Expected question to be multiple selection");
            var expected = codes.ToDictionary(item => item, item => true);
            foreach (KeyValuePair<string, bool> t in question.MultipleSelectionAnswer.Items)
            {
                if (expected.ContainsKey(t.Key))
                {
                    Assert.IsTrue(t.Value, string.Format("Expected question {0} code {1} to be true", questionId, t.Key));
                }
                else
                {
                    Assert.IsFalse(t.Value, string.Format("Expected question {0} code {1} to be false", questionId, t.Key));                    
                }
            }
        }


        [Then(@"the questions with (ids .*) should have value (.*) in the database")]
        public void ThenTheQuestionsShouldBeInTheDatabase(List<string> questionIds, object value)
        {
            if (value != null && value.Equals("null"))
                value = null;
            foreach (string questionId in questionIds)
            {
                var question = _instanceContext.QuestionService.GetQuestion(questionId);
                var answer = question.Answer;
                if (answer != null) answer = answer.ToString();
                Assert.AreEqual(value, answer);
            }
        }

         
    }
}