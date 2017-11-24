using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Constants;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyExecution.Questions;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyExecution.Validators
{
    public class RangeNumberValidator : QuestionValidator
    {
        public RangeNumberValidator(IResourceManager resourceManager) : base(resourceManager)
        {
        }

        public override IList<QuestionError> Validate(Question question)
        {
            var errors = new List<QuestionError>();

            var numberQuestion = question as NumericQuestion;
            if (numberQuestion == null) return errors;

            var answer = Convert.ToString(question.Answer);
            if (string.IsNullOrEmpty(answer)) return errors;

            double numberAnswer;
            if (!double.TryParse(answer, out numberAnswer))
            {
                errors.Add(new QuestionError(ValidationConstants.QuestionNumeric, "Answer is not numeric"));
                return errors;
            }

            if (Min != null && Max != null && (numberAnswer < Min || numberAnswer > Max))
            {
                errors.Add(BuildErrorFromMessageKey(ValidationConstants.QuestionNumberMinMax, question.Title, Min, Max));
                return errors;
            }
            if (Min != null && numberAnswer < Min)
            {
                errors.Add(BuildErrorFromMessageKey(ValidationConstants.QuestionNumberMin, question.Title, Min));
                return errors;
            }
            if (Max != null && numberAnswer > Max)
            {
                errors.Add(BuildErrorFromMessageKey(ValidationConstants.QuestionNumberMax, question.Title, Max));
            }

            return errors;
        }

        public int? Min { get; set; }
        public int? Max { get; set; }
        public override string ValidationType => QuestionValidationTypeConstants.RangeNumberValidation;
    }
}