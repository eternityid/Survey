using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.Expressions;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext
{
    internal class ExpressionMap : EntityTypeConfiguration<Expression>
    {
        public ExpressionMap()
        {
            // Primary Key
            HasKey(t => new { t.Id });

            // Properties
            Property(t => t.Id)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);

            Property(t => t.SurveyId)
                .HasColumnAnnotation("Index", new IndexAnnotation(new IndexAttribute()));

            HasMany(k => k.ExpressionItems)
                .WithRequired()
                .HasForeignKey(k => k.ExpressionId).WillCascadeOnDelete(true);
            ToTable("Expressions");
        }
    }
}
