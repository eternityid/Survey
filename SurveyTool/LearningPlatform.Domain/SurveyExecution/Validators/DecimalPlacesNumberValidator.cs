using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Constants;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.UtilServices;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyExecution.Validators
{
    public class DecimalPlacesNumberValidator : QuestionValidator
    {
        public DecimalPlacesNumberValidator(IResourceManager resourceManager) : base(resourceManager)
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
            if (CalculatingService.GetDecimalPlaces(numberAnswer).Length > DecimalPlaces)
            {
                errors.Add(BuildErrorFromMessageKey(ValidationConstants.QuestionNumberDecimalPlaces, question.Title, DecimalPlaces, numberAnswer));
            }
            return errors;
        }

        public int? DecimalPlaces { get; set; }
        public override string ValidationType => QuestionValidationTypeConstants.DecimalPlacesNumberValidation;

    }
}