using LearningPlatform.Domain.SurveyDesign;
using System.Data.Entity.ModelConfiguration;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext
{
    internal class SurveySettingsMap : EntityTypeConfiguration<SurveySettings>
    {
        public SurveySettingsMap()
        {
            HasOptional(p => p.NextButtonText)
                .WithMany()
                .Map(m => m.MapKey("NextButtonTextId"));

            HasOptional(p => p.PreviousButtonText)
                .WithMany()
                .Map(m => m.MapKey("PreviousButtonTextId"));

            HasOptional(p => p.FinishButtonText)
                .WithMany()
                .Map(m => m.MapKey("FinishButtonTextId"));

            Ignore(p => p.Languages);
            Property(t => t.LanguagesString).HasColumnName("Languages");
        }
    }
}