using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Constants;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyExecution.Questions;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace LearningPlatform.Domain.SurveyExecution.Validators
{
    /// <summary>
    /// A regular expression needs to match for the question to be valid
    /// </summary>
    public class RegularExpressionValidator : QuestionValidator
    {
        public RegularExpressionValidator(IResourceManager resourceManager) : base(resourceManager)
        {
        }

        public EvaluationString ErrorMessage { get; set; }
        public string MatchPattern { get; set; }

        public override IList<QuestionError> Validate(Question question)
        {
            var errors = new List<QuestionError>();
            var regExp = new Regex(MatchPattern);
            var stringAnswer = question.Answer as string;
            if (stringAnswer == null || !regExp.IsMatch(stringAnswer))
            {
                errors.Add(new QuestionError(ValidationConstants.QuestionRegularExpression, ErrorMessage.ToString()));
            }

            return errors;
        }

        public override string ValidationType => QuestionValidationTypeConstants.RegularExpressionValidation;
    }
}