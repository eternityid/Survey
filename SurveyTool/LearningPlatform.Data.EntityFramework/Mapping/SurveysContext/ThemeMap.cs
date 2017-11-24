using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyThemes;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext
{
    internal class ThemeMap : EntityTypeConfiguration<Theme>
    {
        public ThemeMap()
        {
            Property(t => t.Name)
                .IsRequired()
                .IsVariableLength()
                .HasMaxLength(30);

            Property(t => t.Type)
                .HasColumnAnnotation("Index", new IndexAnnotation(new IndexAttribute()));

            ToTable("Themes");
        }
    }
}
