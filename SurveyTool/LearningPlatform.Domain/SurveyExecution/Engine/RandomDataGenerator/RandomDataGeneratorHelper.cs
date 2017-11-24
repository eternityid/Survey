using System;
using System.Linq;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Validation;

namespace LearningPlatform.Domain.SurveyExecution.Engine.RandomDataGenerator
{
    public class RandomDataGeneratorHelper
    {
        private readonly IThreadSafeRandom _random;

        public RandomDataGeneratorHelper(IThreadSafeRandom random)
        {
            _random = random;
        }

        public bool ShouldAnswerQuestion(QuestionDefinition definition, bool isInRequiredGridQuestion)
        {
            if (isInRequiredGridQuestion) return true;

            var required = GetQuestionValidation<RequiredValidation>(definition);
            const int defaultProbability = 50;
            short randomDataSelectionProbability = definition.RandomDataSelectionProbability??defaultProbability;
            return required != null || randomDataSelectionProbability > _random.Next(0, 100);
        }

        public int GetNumberToPick<T>(QuestionDefinition definition, int defaultMin, int defaultMax) where T : MinMaxValidation
        {
            if (defaultMax == 0) return 0;
            var selection = GetQuestionValidation<T>(definition);
            int minNumberToPick = defaultMin;
            int maxNumberToPick = defaultMax;
            if (selection != null)
            {
                if (selection.Min.HasValue) minNumberToPick = selection.Min.Value;
                if (selection.Max.HasValue) maxNumberToPick = selection.Max.Value;
            }
            return _random.Next(minNumberToPick, maxNumberToPick);
        }

        private static T GetQuestionValidation<T>(QuestionDefinition definition) where T : QuestionValidation
        {
            return (T)definition.Validations.FirstOrDefault(d => d.GetType() == typeof(T));
        }
    }
}