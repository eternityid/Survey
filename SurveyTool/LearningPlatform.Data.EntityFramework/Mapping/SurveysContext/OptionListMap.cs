using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext
{
    internal class OptionListMap : EntityTypeConfiguration<OptionList>
    {
        public OptionListMap()
        {
            Property(t => t.Name)
                .IsOptional()
                .IsVariableLength()
                .HasMaxLength(30);

            Property(t => t.SurveyId)
                .HasColumnAnnotation("Index", new IndexAnnotation(new IndexAttribute()));

            HasMany(optionList => optionList.Options)
                .WithRequired()
                .HasForeignKey(option => option.ListId);

            HasMany(optionList => optionList.OptionGroups)
                .WithRequired()
                .HasForeignKey(optionGroup => optionGroup.ListId).WillCascadeOnDelete(true);

            ToTable("OptionLists");
        }
    }
}
