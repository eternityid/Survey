using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.Questions;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Questions
{
    internal class GridQuestionDefinitionMap : EntityTypeConfiguration<GridQuestionDefinition>
    {
        public GridQuestionDefinitionMap()
        {
            HasOptional(p => p.SubQuestionDefinition)
                .WithMany()
                .Map(m => m.MapKey("SubQuestionDefinitionId"));

            Property(p => p.Transposed)
                .HasColumnName("Transposed");
            
            ToTable("Questions");
        }
    }
}
