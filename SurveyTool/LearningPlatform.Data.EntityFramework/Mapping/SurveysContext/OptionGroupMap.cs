using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext
{
    internal class OptionGroupMap : EntityTypeConfiguration<OptionGroup>
    {
        public OptionGroupMap()
        {
            HasOptional(optionGroup => optionGroup.Heading)
                .WithMany()
                .Map(m => m.MapKey("HeadingId"));
            
            ToTable("OptionGroups");
        }
    }
}
