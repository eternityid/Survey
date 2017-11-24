using LearningPlatform.Domain.SurveyPublishing;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext
{
    internal class SurveyVersionsMap : EntityTypeConfiguration<SurveyVersion>
    {
        public SurveyVersionsMap()
        {
            Property(t => t.SurveyId)
                .HasColumnAnnotation("Index", new IndexAnnotation(new IndexAttribute()));
        }
    }
}
