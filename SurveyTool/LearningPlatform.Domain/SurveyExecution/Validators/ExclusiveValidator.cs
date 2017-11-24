using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Constants;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyExecution.Questions;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyExecution.Validators
{
    /// <summary>
    /// Multi selection where some options are marked as exclusive
    /// </summary>
    public class ExclusiveValidator : QuestionValidator
    {
        public ExclusiveValidator(IResourceManager resourceManager) : base(resourceManager)
        {
        }

        public override IList<QuestionError> Validate(Question question)
        {
            var errors = new List<QuestionError>();

            var multiSelectQuestion = question as MultipleSelectionQuestion;
            if (multiSelectQuestion == null) return errors;

            string exclusiveOption = null;
            var selectedCount = 0;
            foreach (var option in multiSelectQuestion.Options)
            {
                if (exclusiveOption == null &&
                    (option.IsNotApplicable || option.IsExclusive) &&
                    multiSelectQuestion.IsChecked(option))
                {
                    exclusiveOption = option.Text;
                }
                if (multiSelectQuestion.IsChecked(option)) selectedCount++;
                if (exclusiveOption != null && selectedCount > 1)
                {
                    errors.Add(BuildErrorFromMessageKey(ValidationConstants.ExclusiveViolation, question.Title, exclusiveOption));
                    return errors;
                }
            }
            return errors;
        }

        public override string ValidationType => QuestionValidationTypeConstants.ExclusiveValidation;
    }
}