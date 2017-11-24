using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.ReportDesign;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Reports
{
    internal class ReportPageDefinitionMap : EntityTypeConfiguration<ReportPageDefinition>
    {
        public ReportPageDefinitionMap()
        {
            Property(t => t.ReportId)
                .HasColumnAnnotation("Index", new IndexAnnotation(new IndexAttribute()));

            ToTable("ReportPages");
        }
    }

}