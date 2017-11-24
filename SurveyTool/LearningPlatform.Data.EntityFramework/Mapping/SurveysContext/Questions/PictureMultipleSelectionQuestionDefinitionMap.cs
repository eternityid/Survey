using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.Questions;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Questions
{
    internal class PictureMultipleSelectionQuestionDefinitionMap : EntityTypeConfiguration<PictureMultipleSelectionQuestionDefinition>
    {
        public PictureMultipleSelectionQuestionDefinitionMap()
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
