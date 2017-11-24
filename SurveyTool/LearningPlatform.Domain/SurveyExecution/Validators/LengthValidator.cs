using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Constants;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyExecution.Questions;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyExecution.Validators
{
    public class LengthValidator : QuestionValidator
    {
        public LengthValidator(IResourceManager resourceManager) : base(resourceManager)
        {
        }

        public override IList<QuestionError> Validate(Question question)
        {
            var errors = new List<QuestionError>();

            var gridQuestion = question as GridQuestion;
            if (gridQuestion != null)
            {
                foreach (var subQuestion in gridQuestion.Questions)
                {
                    var subQuestionErrors = Validate(subQuestion);
                    errors.AddRange(subQuestionErrors);
                }
            }
            else
            {
                var textQuestionErrors = ValidateTextQuestion(question);
                errors.AddRange(textQuestionErrors);
            }

            return errors;
        }

        private IList<QuestionError> ValidateTextQuestion(Question question)
        {
            var errors = new List<QuestionError>();

            var textQuestion = question as OpenEndedTextQuestion;
            if (textQuestion == null) return errors;

            var answerLength = question.Answer?.ToString().Trim().Length ?? 0;

            if (Min != null && Max != null && (answerLength < Min || answerLength > Max))
            {
                errors.Add(BuildErrorFromMessageKey(ValidationConstants.QuestionLengthMinMax, question.Title, Min, Max));
                return errors;
            }
            if (Min != null && answerLength < Min)
            {
                errors.Add(BuildErrorFromMessageKey(ValidationConstants.QuestionLengthMin, question.Title, Min));
                return errors;
            }
            if (Max != null && answerLength > Max)
            {
                errors.Add(BuildErrorFromMessageKey(ValidationConstants.QuestionLengthMax, question.Title, Max));
            }

            return errors;
        }

        public int? Min { get; set; }
        public int? Max { get; set; }
        public override string ValidationType => QuestionValidationTypeConstants.LengthValidation;
    }
}