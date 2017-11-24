using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.Questions;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Questions
{
    internal class MatrixQuestionDefinitionMap :  EntityTypeConfiguration<MatrixQuestionDefinition>
    {
        public MatrixQuestionDefinitionMap()
        {
            HasMany(t => t.QuestionDefinitions)
                .WithOptional(o => o.ParentQuestion)
                .Map(m => m.MapKey("ParentQuestionId"));

            Property(p => p.Transposed)
                .HasColumnName("Transposed");

            ToTable("Questions");
        }
         
    }
}