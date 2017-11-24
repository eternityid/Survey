using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.SurveyExecution.TableLayout
{
    public class ListButtonCell : ITableCell
    {
        public ListButtonCell(SingleSelectionQuestion question)
        {
            Id = question.Alias;
            Question = question;
        }

        public SingleSelectionQuestion Question { get; set; }
        public string Id { get; set; }

        public override bool Equals(object obj)
        {
            var checkedItem = obj as RatingCell;
            if (checkedItem == null) return false;

            return obj.GetType() == GetType()
                   && Id == checkedItem.Id;
        }

        public override int GetHashCode()
        {
            int hash = 0;
            if (Id != null) hash |= Id.GetHashCode();
            return hash;
        }
    }
}
