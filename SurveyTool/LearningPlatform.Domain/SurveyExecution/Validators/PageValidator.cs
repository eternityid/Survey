using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.SurveyExecution.Validators
{
    public class PageValidator : IPageValidator
    {
        public void Validate(Page page)
        {
            foreach (Question question in page.Questions)
            {
                if (question.Hidden) continue;

                ValidateQuestion(page, question);

                ValidateOtherQuestion(page, question);
            }
        }

        private void ValidateOtherQuestion(Page page, Question question)
        {
            var questionWithOptions = question as QuestionWithOptions;
            if (questionWithOptions == null) return;

            foreach (var other in questionWithOptions.GetOtherQuestions())
            {
                if (other.IsOptionSelected) ValidateQuestion(page, other.Question);
            }
        }

        private void ValidateQuestion(Page page, Question question)
        {
            if (question.Validators == null) return;

            foreach (var validator in question.Validators)
            {
                validator.Validate(page, question);
            }
        }
    }
}