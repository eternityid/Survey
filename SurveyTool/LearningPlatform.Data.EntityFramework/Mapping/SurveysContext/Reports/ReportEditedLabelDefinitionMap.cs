using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.ReportDesign.ReportEditedLabel;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Reports
{
    internal class ReportEditedLabelDefinitionMap:EntityTypeConfiguration<ReportEditedLabelDefinition>
    {
        public ReportEditedLabelDefinitionMap()
        {
            Property(t => t.Id)
                .IsRequired();

            ToTable("ReportEditedLabels");
        }
    }
}
