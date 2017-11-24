using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.ReportDesign;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Reports
{
    internal class ReportElementDefinitionMap : EntityTypeConfiguration<ReportElementDefinition>
    {
        public ReportElementDefinitionMap()
        {
            Property(t => t.ReportId)
                .HasColumnAnnotation("Index", new IndexAnnotation(new IndexAttribute()));

            ToTable("ReportElements");
        }
    }
}