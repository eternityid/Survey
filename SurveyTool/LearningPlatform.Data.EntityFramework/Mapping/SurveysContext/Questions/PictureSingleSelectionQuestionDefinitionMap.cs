using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.Questions;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Questions
{
    internal class PictureSingleSelectionQuestionDefinitionMap : EntityTypeConfiguration<PictureSingleSelectionQuestionDefinition>
    {
        public PictureSingleSelectionQuestionDefinitionMap()
        {
            Property(p => p.IsPictureShowLabel)
                .HasColumnName("IsPictureShowLabel");
            Property(p => p.IsScalePictureToFitContainer)
                .HasColumnName("IsScalePictureToFitContainer");
            Property(p => p.MaxPicturesInGrid)
                .HasColumnName("MaxPicturesInGrid");

            ToTable("Questions");
        }
    }
}
