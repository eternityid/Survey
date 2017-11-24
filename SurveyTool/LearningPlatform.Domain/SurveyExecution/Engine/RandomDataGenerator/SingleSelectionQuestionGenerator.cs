using System;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.SurveyExecution.Engine.RandomDataGenerator
{
    public class SingleSelectionQuestionGenerator : IAnswerGenerator
    {
        private readonly IThreadSafeRandom _random;

        public SingleSelectionQuestionGenerator(IThreadSafeRandom random)
        {
            _random = random;
        }

        public Type TypeFor { get { return typeof (SingleSelectionQuestion); } }
        public void GenerateAnswer(Question question, QuestionDefinition definition, AnswerGeneratorService answerGeneratorService)
        {
            var questionWithOptionsDefinition = (QuestionWithOptionsDefinition)definition;
            var options = questionWithOptionsDefinition.OptionList.Options;
            if (options.Count == 0) return;

            var index = _random.Next(0, options.Count);
            question.Answer = options[index].Alias;
        }
    }
}