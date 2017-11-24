namespace LearningPlatform.Domain.SurveyExecution.TableLayout
{
    public class LabelCell : ITableCell
    {
        public string Description { get; set; }
        public string Title { get; set; }
        public int? Span { get; set; }
        public string Id { get; set; }

        public override bool Equals(object obj)
        {
            var labelCell = obj as LabelCell;
            if (labelCell == null) return false;

            return Description==labelCell.Description
                   && Title == labelCell.Title
                   && Span == labelCell.Span;
        }

        public override int GetHashCode()
        {
            int hash = 0;
            if (Description != null) hash |= Description.GetHashCode();
            if (Title != null) hash |= Title.GetHashCode();
            if (Span != null) hash |= Span.GetHashCode();
            return hash;
        }

    }
}