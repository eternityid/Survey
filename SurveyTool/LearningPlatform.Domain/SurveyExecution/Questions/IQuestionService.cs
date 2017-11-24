using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public interface IQuestionService
    {
        Question GetQuestion(string questionId);
        IList<Question> GetQuestionsWithAnswers(IList<string> questionAliases);
        void SaveQuestion(Question question);
        void SaveQuestions(ICollection<Question> questions);
        void CleanQuestions(IList<string> questionIds);
        IList<Question> GetExpandedQuestions(IEnumerable<Question> questions);
    }
}