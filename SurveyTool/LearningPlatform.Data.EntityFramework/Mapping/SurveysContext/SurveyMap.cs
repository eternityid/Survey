using LearningPlatform.Domain.SurveyDesign;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext
{
    internal class SurveyMap : EntityTypeConfiguration<Survey>
    {
        public SurveyMap()
        {
            HasOptional(survey => survey.TopFolder)
                .WithMany()
                .HasForeignKey(survey => survey.TopFolderId);

            HasRequired(survey => survey.SurveySettings)
                .WithMany()
                .HasForeignKey(survey => survey.SurveySettingsId);

            Property(survey => survey.UserId)
                .HasMaxLength(36)
                .IsUnicode(false)
                .HasColumnAnnotation("Index", new IndexAnnotation(new IndexAttribute()));

            Property(t => t.RowVersion).IsRowVersion();

            Ignore(p => p.SharedOptionLists);
            Ignore(p => p.AccessRights);
        }
    }
}