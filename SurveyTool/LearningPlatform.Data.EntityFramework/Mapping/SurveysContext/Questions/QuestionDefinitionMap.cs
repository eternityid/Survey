using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.Questions;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Questions
{
    internal class QuestionDefinitionMap : EntityTypeConfiguration<QuestionDefinition>
    {
        public QuestionDefinitionMap()
        {
            Property(t=>t.SurveyId)
                .IsRequired()
                .HasColumnAnnotation("Index", new IndexAnnotation(new IndexAttribute()));

            Property(t => t.Alias)
                .IsRequired()
                .IsVariableLength()
                .HasMaxLength(50);

            HasOptional(p => p.Title)
                .WithMany()
                .Map(m => m.MapKey("TitleId"));

            HasOptional(p => p.Description)
                .WithMany()
                .Map(m => m.MapKey("DecriptionId"));

            HasOptional(p => p.QuestionMaskExpression)
                .WithMany()
                .Map(m => m.MapKey("QuestionMaskExpressionId"));

            HasMany(p => p.Validations);

            Property(t => t.RowVersion).IsRowVersion();

            ToTable("Questions");
        }
    }
}
