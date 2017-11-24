using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyLayout;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext
{
    internal class LayoutMap : EntityTypeConfiguration<Layout>
    {
        public LayoutMap()
        {
            Property(t => t.Name)
                .IsRequired()
                .IsVariableLength()
                .HasMaxLength(30);

            HasMany(p => p.Templates)
                .WithRequired()
                .HasForeignKey(p=>p.LayoutId);

            Property(t => t.RowVersion).IsRowVersion();

            ToTable("Layouts");
        }
    }
}
