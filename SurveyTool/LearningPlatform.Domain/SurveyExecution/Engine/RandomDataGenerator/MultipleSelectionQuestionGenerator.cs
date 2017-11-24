using System;
using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyDesign.Validation;
using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.SurveyExecution.Engine.RandomDataGenerator
{
    public class MultipleSelectionQuestionGenerator : IAnswerGenerator
    {
        private readonly RandomDataGeneratorHelper _randomDataGeneratorHelper;
        private readonly IThreadSafeRandom _random;

        public MultipleSelectionQuestionGenerator(RandomDataGeneratorHelper randomDataGeneratorHelper, IThreadSafeRandom random)
        {
            _randomDataGeneratorHelper = randomDataGeneratorHelper;
            _random = random;
        }

        public Type TypeFor { get { return typeof (MultipleSelectionQuestion); } }
        public void GenerateAnswer(Question question, QuestionDefinition definition, AnswerGeneratorService answerGeneratorService)
        {
            var questionWithOptionsDefinition = (QuestionWithOptionsDefinition)definition;
            var options = questionWithOptionsDefinition.OptionList.Options;
            var answer = Selection(options, _randomDataGeneratorHelper.GetNumberToPick<SelectionValidation>(definition, 1, options.Count));
            question.Answer = answer;
        }

        private Dictionary<string, bool> Selection(IList<Option> options, int numberToPick)
        {
            var values = options.Select(o => o.Alias).ToList();

            var answer = new Dictionary<string, bool>();
            for (int i = 0; i < numberToPick; i++)
            {
                if (values.Count == 0) break;

                var index = _random.Next(0, values.Count);
                answer.Add(values[index], true);
                values.RemoveAt(index);
            }
            return answer;
        }
    }
}