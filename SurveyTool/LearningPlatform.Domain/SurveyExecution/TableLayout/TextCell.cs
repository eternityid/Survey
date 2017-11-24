namespace LearningPlatform.Domain.SurveyExecution.TableLayout
{
    public class TextCell : ITableCell
    {
        public string Text { get; set; }

        public override bool Equals(object obj)
        {
            var textCell = obj as TextCell;
            if (textCell == null) return false;

            return Text == textCell.Text;
        }

        public override int GetHashCode()
        {
            return Text==null?0:Text.GetHashCode();
        }
    }
}