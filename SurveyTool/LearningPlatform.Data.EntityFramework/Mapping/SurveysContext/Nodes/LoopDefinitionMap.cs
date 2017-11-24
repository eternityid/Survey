using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Nodes
{
    internal class LoopDefinitionMap : EntityTypeConfiguration<LoopDefinition>
    {
        public LoopDefinitionMap()
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

            HasOptional(p => p.OptionList)
                .WithMany()
                .Map(m => m.MapKey("OptionListId"));

            Ignore(p => p.OptionListId);
            ToTable("Loops");
        }
    }
}
