using LearningPlatform.Domain.SurveyDesign.LanguageStrings;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Services.Question
{
    public class ValidateQuestionService
    {
        private readonly IQuestionDefinitionRepository _questionDefinitionRepository;

        public ValidateQuestionService(IQuestionDefinitionRepository questionDefinitionRepository)
        {
            _questionDefinitionRepository = questionDefinitionRepository;
        }

        public ValidationResult Validate(QuestionDefinition question)
        {
            if (question == null)
            {
                return new ValidationResult
                {
                    Valid = false,
                    Message = "Question is null"
                };
            }

            var aliasValidationResult = ValidateAlias(question);
            if (!aliasValidationResult.Valid)
            {
                return aliasValidationResult;
            }

            var titleValidationResult = ValidateTitle(question.Title);
            if (!titleValidationResult.Valid)
            {
                return titleValidationResult;
            }

            var pictureOptionsValidationResult = ValidatePictureOptions(question as QuestionWithOptionsDefinition);
            if (!pictureOptionsValidationResult.Valid)
            {
                return pictureOptionsValidationResult;
            }

            return new ValidationResult
            {
                Valid = true
            };
        }

        private ValidationResult ValidateAlias(QuestionDefinition question)
        {
            var questionAliases = _questionDefinitionRepository.GetQuestionAliases(question.SurveyId, question.Alias);
            const int expectedAliasCount = 1;

            if (questionAliases.Count == expectedAliasCount && questionAliases.First().Id != question.Id
                || questionAliases.Count > expectedAliasCount)
            {
                return new ValidationResult
                {
                    Valid = false,
                    Message = "Duplicate question alias"
                };
            }

            return new ValidationResult
            {
                Valid = true
            };
        }

        private ValidationResult ValidateTitle(LanguageString title)
        {
            var isValidTitle = title?.Items == null || !title.Items.Any() || string.IsNullOrWhiteSpace(title.Items.First().Text);
            if (isValidTitle)
            {
                return new ValidationResult
                {
                    Valid = false,
                    Message = "Question title is required"
                };
            }

            return new ValidationResult
            {
                Valid = true
            };

        }

        private ValidationResult ValidatePictureOptions(QuestionWithOptionsDefinition questionWithOptions)
        {
            if (questionWithOptions == null)
            {
                return new ValidationResult
                {
                    Valid = true
                };
            }

            if (!(questionWithOptions is PictureSingleSelectionQuestionDefinition) &&
                !(questionWithOptions is PictureMultipleSelectionQuestionDefinition))
            {
                return new ValidationResult
                {
                    Valid = true
                };
            }


            if (questionWithOptions.OptionList.Options.Any(w => string.IsNullOrWhiteSpace(w.PictureName)))
            {
                return new ValidationResult
                {
                    Valid = false,
                    Message = "Missing option picture"
                };
            }

            return new ValidationResult
            {
                Valid = true
            };
        }
    }
}
