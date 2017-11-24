using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.LanguageStrings;
using LearningPlatform.Domain.SurveyDesign.Pages;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Services.Page
{
    public class ValidatePageService
    {
        public ValidationResult Validate(PageDefinition page)
        {
            if (page == null)
            {
                return new ValidationResult
                {
                    Valid = false,
                    Message = "Page is null"
                };
            }

            var titleValidationResult = ValidateTitle(page.Title);
            if (!titleValidationResult.Valid)
            {
                return titleValidationResult;
            }

            return ValidateSkipCommands(page.SkipCommands);
        }

        public ValidationResult ValidateTitle(LanguageString title)
        {
            var isValidTitle = title?.Items == null || !title.Items.Any() || string.IsNullOrWhiteSpace(title.Items.First().Text);
            if (isValidTitle)
            {
                return new ValidationResult
                {
                    Valid = false,
                    Message = "Page title is required"
                };
            }

            return new ValidationResult
            {
                Valid = true
            };
        }

        public ValidationResult ValidateSkipCommands(ICollection<SkipCommand> skipCommands)
        {
            if (!skipCommands.Any())
            {
                return new ValidationResult
                {
                    Valid = true
                };
            }

            var invalidSkipCommand = skipCommands.FirstOrDefault(p => string.IsNullOrWhiteSpace(p.SkipToQuestionId));
            if (invalidSkipCommand != null)
            {
                return new ValidationResult
                {
                    Valid = false,
                    Message = "Missing destination question id in skip command"
                };
            }

            return new ValidationResult
            {
                Valid = true
            };
        }
    }
}
