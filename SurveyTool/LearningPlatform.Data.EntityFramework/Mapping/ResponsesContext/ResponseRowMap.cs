using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;

namespace LearningPlatform.Data.EntityFramework.Mapping.ResponsesContext
{
    internal class ResponseRowMap : EntityTypeConfiguration<ResponseRow>
    {
        public ResponseRowMap(bool isTestMapping)
        {
            // Primary Key
            HasKey(t => new { t.Id });

            // Properties
            Property(t => t.Id)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);

            Property(t => t.QuestionName)
                .IsVariableLength()
                .IsUnicode(false)
                .IsRequired()
                .HasMaxLength(100);

            Property(t => t.Alias)
                .IsVariableLength()
                .IsUnicode(false)
                .HasMaxLength(30);

            Property(t => t.LoopState.Value)
                .IsOptional()
                .IsVariableLength()
                .HasMaxLength(255)
                .HasColumnName("LoopState");

            // Table & Column Mappings
            ToTable(isTestMapping?"TestAnswers":"Answers");
        }
    }
}
