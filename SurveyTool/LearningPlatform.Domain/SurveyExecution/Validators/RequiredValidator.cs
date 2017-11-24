using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Constants;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyExecution.Questions;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyExecution.Validators
{
    public class RequiredValidator : QuestionValidator
    {
        public RequiredValidator(IResourceManager resourceManager) : base(resourceManager)
        {
        }

        public override IList<QuestionError> Validate(Question question)
        {
            var errors = new List<QuestionError>();
            if (!IsAnsweredQuestion(question))
            {
                errors.Add(BuildErrorFromMessageKey(ValidationConstants.QuestionRequired, question.Title));
                return errors;
            }
            var multipleSelection = question as MultipleSelectionQuestion;
            if (multipleSelection == null) return errors;

            if (multipleSelection.MultipleSelectionAnswer.Items.Values.All(itemValue => !itemValue))
            {
                errors.Add(BuildErrorFromMessageKey(ValidationConstants.QuestionRequired, question.Title));
            }
            return errors;
        }

        private bool IsAnsweredQuestion(Question question)
        {
            var gridQuestion = question as GridQuestion;
            if (gridQuestion != null)
            {
                var subQuestions = gridQuestion.Questions;

                int subQuestionAnsweredCount = 0;
                foreach (var subQuestion in subQuestions)
                {
                    var multipleSelectionQuestion = subQuestion as MultipleSelectionQuestion;
                    var singleSelectionQuestion = subQuestion as SingleSelectionQuestion;
                    var openEndedTextQuestion = subQuestion as OpenEndedTextQuestion;
                    if (multipleSelectionQuestion != null)
                    {
                        var answers = (Dictionary<string, bool>)multipleSelectionQuestion.Answer;
                        if (answers.Any(answer => answer.Value))
                        {
                            subQuestionAnsweredCount++;
                        }
                    }
                    else if (singleSelectionQuestion != null)
                    {
                        if (singleSelectionQuestion.Answer != null && !singleSelectionQuestion.Answer.Equals(""))
                            subQuestionAnsweredCount++;
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(openEndedTextQuestion?.OpenAnswer.Trim())) subQuestionAnsweredCount++;
                    }
                }
                return subQuestionAnsweredCount != 0 && subQuestionAnsweredCount == subQuestions.Count;
            }
            if (question is OpenEndedShortTextQuestion || question is OpenEndedLongTextQuestion)
            {
                return question.Answer != null && question.Answer.ToString().Trim() != "";
            }
            if (question.Answer != null && !question.Answer.Equals("")) return true;
            return false;
        }

        public override string ValidationType => QuestionValidationTypeConstants.RequiredValidation;
    }
}