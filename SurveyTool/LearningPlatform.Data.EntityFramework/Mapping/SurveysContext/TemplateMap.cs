using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyLayout;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext
{
    internal class TemplateMap : EntityTypeConfiguration<Template>
    {
        public TemplateMap()
        {
            Property(t => t.Name)
                .IsOptional()
                .IsVariableLength()
                .HasMaxLength(30);
            Ignore(t => t.Items);
            ToTable("Templates");
        }
    }
}
