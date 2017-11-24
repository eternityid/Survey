using System.Collections.Specialized;
using LearningPlatform.Domain.SurveyExecution.Options;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public class OtherQuestion
    {
        public void Initialize(NameValueCollection form)
        {
            Question.Initialize(form);
        }

        public Question Question { get; set; }
        public QuestionWithOptions ParentQuestion { get; set; }
        public Option Option { get; set; }

        public bool IsOptionSelected
        {
            get
            {
                var selectableQuestion = ParentQuestion as ISelectableQuestion;
                return selectableQuestion != null && selectableQuestion.IsChecked(Option);
            }
        }

    }
}