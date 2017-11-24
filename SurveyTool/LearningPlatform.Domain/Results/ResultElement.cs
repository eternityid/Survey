using LearningPlatform.Domain.ReportDesign;
using LearningPlatform.Domain.ReportDesign.ReportElements;

namespace LearningPlatform.Domain.Results
{
    public class ResultElement : ReportChartElement
    {
        public int? ColumnWidth { get; set; }

        public ResultElement() { }

        public ResultElement(
            long reportId,
            long reportPageDefinitionId,
            string questionAlias,
            ReportChartType chartType,
            int? columnWidth): base(reportId, reportPageDefinitionId, questionAlias, chartType)
        {
            ColumnWidth = columnWidth;
        }
    }
}
