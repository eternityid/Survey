using System;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.SurveyExecution.Engine.RandomDataGenerator
{
    public class NumericQuestionGenerator : IAnswerGenerator
    {
        private readonly IThreadSafeRandom _random;

        public NumericQuestionGenerator(IThreadSafeRandom random)
        {
            _random = random;
        }

        public Type TypeFor { get { return typeof (NumericQuestion); } }
        public void GenerateAnswer(Question question, QuestionDefinition definition, AnswerGeneratorService answerGeneratorService)
        {
            question.Answer = _random.Next(0, 9999);
        }

    }
}