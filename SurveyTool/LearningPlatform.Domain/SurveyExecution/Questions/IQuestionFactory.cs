using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using System.Collections.Generic;
using System.Collections.Specialized;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public interface IQuestionFactory
    {
        Question CreateQuestion(string questionId);
        Question CreateQuestion(QuestionDefinition questionDefinition, NameValueCollection form);
        IList<Question> CreateQuestionsForPage(PageDefinition pageDefinition, NameValueCollection form);
    }
}