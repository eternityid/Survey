using LearningPlatform.Domain.ReportDesign;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Reports
{
    internal class ReportDefinitionMap : EntityTypeConfiguration<ReportDefinition>
    {
        public ReportDefinitionMap()
        {
            Property(reportDefinition => reportDefinition.Name)
               .IsRequired()
               .IsVariableLength()
               .HasMaxLength(255);

            Property(reportDefinition => reportDefinition.SurveyId)
                .IsRequired()
                .HasColumnAnnotation("Index", new IndexAnnotation(new IndexAttribute()));

            Property(reportDefinition => reportDefinition.UserId)
                .HasMaxLength(36)
                .IsUnicode(false)
                .HasColumnAnnotation("Index", new IndexAnnotation(new IndexAttribute()));



            ToTable("Reports");
        }
    }
}