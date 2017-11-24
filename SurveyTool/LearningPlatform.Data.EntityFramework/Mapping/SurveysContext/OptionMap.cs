using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext
{
    public class OptionMap : EntityTypeConfiguration<Option>
    {
        public OptionMap()
        {
            Property(t => t.Alias)
                .IsRequired()
                .IsVariableLength()
                .IsUnicode(false)
                .HasMaxLength(30);

            HasOptional(t => t.Text)
                .WithMany()
                .Map(m => m.MapKey("TextId"));

            Property(p => p.OptionsMask.QuestionId)
                .IsOptional()
                .HasColumnName("OptionsMaskQuestionId");

            Property(p => p.OptionsMask.OptionsMaskType)
                .IsOptional()
                .HasColumnName("OptionsMaskType");

            Property(p => p.OptionsMask.CustomOptionsMask)
                .IsOptional()
                .HasColumnName("OptionsMaskCustomScript");
        }
         
    }
}