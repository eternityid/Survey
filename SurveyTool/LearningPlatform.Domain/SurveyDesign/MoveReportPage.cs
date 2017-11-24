namespace LearningPlatform.Domain.SurveyDesign
{
    public class MoveReportPage
    {
        public long PageId { get; set; }
        public long ReportId { get; set; }
        public int NewIndexPosition { get; set; }
        public int OldIndexPosition { get; set; }
    }
}
