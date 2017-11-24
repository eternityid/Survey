using LearningPlatform.Domain.ReportDesign.ReportEditedLabel;
using System.Collections.Generic;

namespace LearningPlatform.Domain.ReportDesign.ReportElements
{
    public abstract class ReportElementHasQuestion: ReportElementDefinition
    {
        public string QuestionAlias { get; set; }
        public bool? DisplaySummaryTabular { get; set; }

        public ICollection<ReportEditedLabelDefinition> ReportEditedLabelDefinitions { get; set; }

        protected ReportElementHasQuestion()
        {
            ReportEditedLabelDefinitions = new List<ReportEditedLabelDefinition>();
        }
    }
}
