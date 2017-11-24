using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Constants;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyExecution.Questions;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyExecution.Validators
{
    /// <summary>
    /// Example: a numeric needs to be between 1 and 5.
    /// Example: less than 5.
    /// Example: larger than 10.
    /// </summary>
    public class NumberValidator : QuestionValidator
    {
        //min, max, range (min and max)
        public NumberValidator(IResourceManager resourceManager) : base(resourceManager)
        {
        }

        public override IList<QuestionError> Validate(Question question)
        {
            throw new System.NotImplementedException();
        }

        public override string ValidationType => QuestionValidationTypeConstants.DecimalPlacesNumberValidation;
    }
}