using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Constants;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyExecution.Questions;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyExecution.Validators
{
    public abstract class QuestionValidator
    {
        private readonly IResourceManager _resourceManager;

        protected QuestionValidator(IResourceManager resourceManager)
        {
            _resourceManager = resourceManager;
        }

        public long Id { get; set; }

        public abstract string ValidationType { get; }

        public void Validate(Page page, Question question)
        {
            var errors = Validate(question);
            foreach (var error in errors)
            {
                AddErrorMessage(page, question, error);
            }
        }

        public abstract IList<QuestionError> Validate(Question question);

        protected void AddErrorFromMessageKey(Page page, Question question, string messageKey, params object[] args)
        {
            var error = BuildErrorFromMessageKey(messageKey, args);
            AddErrorMessage(page, question, error);
        }

        protected void AddErrorMessage(Page page, Question question, QuestionError error)
        {
            page.Errors.Add(error);
            question.Errors.Add(error);
        }

        protected QuestionError BuildErrorFromMessageKey(string messageKey, params object[] args)
        {
            var errorMessage = _resourceManager.GetString(messageKey, args);
            return string.IsNullOrEmpty(errorMessage)
                ? new QuestionError(ValidationConstants.UnknowError, "Unknown error")
                : new QuestionError(messageKey, errorMessage);
        }
    }
}