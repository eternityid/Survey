using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Constants;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyExecution.Questions;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyExecution.Validators
{
    public class SelectionValidator : QuestionValidator
    {
        public SelectionValidator(IResourceManager resourceManager) : base(resourceManager)
        {
        }

        public override IList<QuestionError> Validate(Question question)
        {
            var errors = new List<QuestionError>();
            var multipleSelection = question as MultipleSelectionQuestion;
            if (multipleSelection == null) return errors;

            var answers = question.Answer as Dictionary<string, bool>;
            if (answers == null) return errors;
            int countAnswers = CountAnswers(answers);

            if (Min != null && Max != null && (countAnswers < Min || countAnswers > Max))
            {
                errors.Add(BuildErrorFromMessageKey(ValidationConstants.QuestionSelectionMinMax, question.Title, Min, Max));
                return errors;
            }
            if (Min != null && countAnswers < Min)
            {
                errors.Add(BuildErrorFromMessageKey(ValidationConstants.QuestionSelectionMin, question.Title, Min));
                return errors;
            }
            if (Max != null && countAnswers > Max)
            {
                errors.Add(BuildErrorFromMessageKey(ValidationConstants.QuestionSelectionMax, question.Title, Max));
            }
            return errors;
        }

        private static int CountAnswers(Dictionary<string, bool> answers)
        {
            var count = 0;
            foreach (var answer in answers)
            {
                if (answer.Value) count++;
            }
            return count;
        }

        public int? Min { get; set; }
        public int? Max { get; set; }
        public override string ValidationType => QuestionValidationTypeConstants.SelectionValidation;
    }
}