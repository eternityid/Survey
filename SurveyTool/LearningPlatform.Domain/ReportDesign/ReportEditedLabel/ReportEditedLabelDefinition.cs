namespace LearningPlatform.Domain.ReportDesign.ReportEditedLabel
{
    public class ReportEditedLabelDefinition
    {
        public long Id { get; set; }
        public long ReportElementHasQuestionId { get; set; }
        public string OriginalContent { get; set; }
        public string LatestContent { get; set; }
        public int Position { get; set; }
        public ReportEditedLabelType ReportEditedLabelType { get; set; }
    }
}
