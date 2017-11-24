using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.LanguageStrings;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext
{
    internal class LanguageStringItemMap : EntityTypeConfiguration<LanguageStringItem>
    {
        public LanguageStringItemMap()
        {
            Property(t => t.Text)
                .IsRequired();

            ToTable("LanguageStringItems");
        }
    }
}