using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.Questions;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Questions
{
    internal class QuestionDefinitionWithOptionsMap : EntityTypeConfiguration<QuestionWithOptionsDefinition>
    {
        public QuestionDefinitionWithOptionsMap()
        {
            Property(p => p.OptionsMask.QuestionId)
                .IsOptional()
                .HasColumnName("OptionsMaskQuestionId");

            Property(p => p.OptionsMask.OptionsMaskType)
                .IsOptional()
                .HasColumnName("OptionsMaskType");

            Property(p => p.OptionsMask.CustomOptionsMask)
                .IsOptional()
                .HasColumnName("OptionsMaskCustomScript");

            HasOptional(definition => definition.OptionList)
                .WithMany()
                .Map(mappingConfiguration => mappingConfiguration.MapKey("OptionListId"));

            Ignore(p => p.ContainsExclusiveOption);
            Ignore(p => p.OptionListId);
            ToTable("Questions");
        }
    }
}
