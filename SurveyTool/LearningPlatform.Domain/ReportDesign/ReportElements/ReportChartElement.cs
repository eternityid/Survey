namespace LearningPlatform.Domain.ReportDesign.ReportElements
{
    public class ReportChartElement: ReportElementHasQuestion
    {
        public ReportChartElement()
        {
        }

        public ReportChartElement(long reportId, long reportPageDefinitionId, string questionAlias, ReportChartType chartType)
        {
            QuestionAlias = questionAlias;
            ChartType = chartType;
            ReportId = reportId;
            ReportPageDefinitionId = reportPageDefinitionId;
            Position = new ElementPosition();
            Size = new ElementSize();
        }

        public ReportChartType ChartType { get; set; }
        public string ChartTypeString => ChartType.ToString().ToLower();
    }
}
