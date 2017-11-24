using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Constants;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyExecution.Questions;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace LearningPlatform.Domain.SurveyExecution.Validators
{

    public class WordsAmountValidator : QuestionValidator
    {
        public WordsAmountValidator(IResourceManager resourceManager) : base(resourceManager)
        {
        }

        public override IList<QuestionError> Validate(Question question)
        {
            var errors = new List<QuestionError>();
            var gridQuestion = question as GridQuestion;
            if (gridQuestion != null)
            {
                var subQuestions = gridQuestion.Questions;
                foreach (var subQuestion in subQuestions)
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

            string[] delimiterChars = { " ", ",", ".", ":", "\t", "\r\n", "?", "!" };
            var stringAnswer = question.Answer.ToString();
            var trimmer = new Regex(@" {2,}");

            foreach (var delimiterChar in delimiterChars)
            {
                stringAnswer = stringAnswer.Replace(delimiterChar, " ");
            }

            stringAnswer = trimmer.Replace(stringAnswer, " ");
            stringAnswer = stringAnswer.Trim();
            int answerWordsAmount = ((question.Answer == null) || (stringAnswer.Length == 0)) ? 0 : stringAnswer.Split(delimiterChars, StringSplitOptions.None).Length;
            if (Min != null && Max != null && (answerWordsAmount < Min || answerWordsAmount > Max))
            {
                errors.Add(BuildErrorFromMessageKey(ValidationConstants.QuestionWordsAmountMinMax, question.Title, Min, Max));
                return errors;
            }
            if (Min != null && answerWordsAmount < Min)
            {
                errors.Add(BuildErrorFromMessageKey(ValidationConstants.QuestionWordsAmountMin, question.Title, Min));
                return errors;
            }
            if (Max != null && answerWordsAmount > Max)
            {
                errors.Add(BuildErrorFromMessageKey(ValidationConstants.QuestionWordsAmountMax, question.Title, Max));
            }
            return errors;
        }


        public int? Min { get; set; }
        public int? Max { get; set; }
        public override string ValidationType => QuestionValidationTypeConstants.WordsAmountValidation;
    }
}
