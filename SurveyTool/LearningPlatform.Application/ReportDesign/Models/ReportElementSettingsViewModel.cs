using LearningPlatform.Domain.ReportDesign;

namespace LearningPlatform.Application.ReportDesign.Models
{
    public class ReportElementSettingsViewModel
    {
        public string SurveyId { get; set; }
        public string QuestionAlias { get; set; }
        public bool DisplaySummaryTabular { get; set; }
        public ReportChartType ChartType { get; set; }
        public int ColumnWidth { get; set; }
        public long ReportPageId { get; set; }
    }
}
