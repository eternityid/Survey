using System.Collections.Generic;
using LearningPlatform.Domain.ReportDesign.ReportElements;
using LearningPlatform.Domain.Results;

namespace LearningPlatform.Domain.ReportDesign
{
    public class ReportPageDefinition
    {
        public long Id { get; set; }

        public long ReportId { get; set; }
        public int Position { get; set; }
        public bool IsDisplaySummaryTabular { get; set; }

        public IList<ReportElementDefinition> ReportElementDefinitions { get; set; }

        public ReportPageDefinition()
        {
            ReportElementDefinitions = new List<ReportElementDefinition>();
        }

        public ReportElementDefinition GetReportElementDefinition(string questionAlias)
        {
            if (string.IsNullOrWhiteSpace(questionAlias)) return null;
            foreach (var reportQuestionDefinition in ReportElementDefinitions)
            {
                dynamic reportElementHasQuestion = null;
                if (reportQuestionDefinition is ReportChartElement) reportElementHasQuestion = reportQuestionDefinition as ReportChartElement;
                if (reportQuestionDefinition is ResultElement) reportElementHasQuestion = reportQuestionDefinition as ResultElement;

                if (reportElementHasQuestion != null && questionAlias.Equals(reportElementHasQuestion.QuestionAlias)) return reportQuestionDefinition;
            }
            return null;
        }
    }
}
