using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Questions;
using System;

namespace LearningPlatform.Domain.SurveyDesign.Services.Question
{
    public class AliasQuestionService
    {
        private readonly IThreadSafeRandom _random;

        public AliasQuestionService(IThreadSafeRandom random)
        {
            _random = random;
        }

        public void EnsureQuestionAlias(QuestionDefinition question)
        {
            if (string.IsNullOrWhiteSpace(question.Alias))
            {
                question.Alias = "Question_" + DateTime.Now.Millisecond + _random.Next();
            }
        }
    }
}
