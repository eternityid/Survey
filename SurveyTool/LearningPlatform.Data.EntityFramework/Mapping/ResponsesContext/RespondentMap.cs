using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.Respondents;
using System.Data.Entity.Infrastructure.Annotations;

namespace LearningPlatform.Data.EntityFramework.Mapping.ResponsesContext
{
    internal class RespondentMap : EntityTypeConfiguration<Respondent>
    {
        public RespondentMap(bool isTestMapping)
        {
            // Primary Key
            HasKey(t => new { t.Id });

            // Properties
            Property(t => t.Id)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
            
            Property(p => p.ResponseStatus)
                .IsVariableLength()
                .IsUnicode()
                .IsRequired()
                .HasMaxLength(30);
            Ignore(p => p.ResponseStatusCode);
            Property(p => p.Credential)
                .IsVariableLength()
                .HasMaxLength(10);

            Property(e => e.ExternalId)
                .HasMaxLength(64)
                .IsUnicode(false)
                .IsOptional()
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute()));
            ToTable(isTestMapping ? "TestRespondents" : "Respondents");
        }
    }
}
