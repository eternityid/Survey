//using LearningPlatform.Core.SurveyExecution.Model;

using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.LanguageStrings;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext
{
    internal class LanguageStringMap : EntityTypeConfiguration<LanguageString>
    {
        public LanguageStringMap()
        {
            Property(t => t.SurveyId)
                .IsRequired()
                .HasColumnAnnotation("Index", new IndexAnnotation(new IndexAttribute()));

            HasMany(k => k.Items)
                .WithRequired()
                .HasForeignKey(k => k.LanguageStringId);

            ToTable("LanguageStrings");
        }
    }

}