using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.Questions;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Questions
{
    internal class SingleSelectionQuestionDefinitionMap : EntityTypeConfiguration<SingleSelectionQuestionDefinition>
    {
        public SingleSelectionQuestionDefinitionMap()
        {
            HasOptional(p => p.LikertLeftText)
                .WithMany()
                .Map(m => m.MapKey("LikertLeftTextId"));

            HasOptional(p => p.LikertCenterText)
                .WithMany()
                .Map(m => m.MapKey("LikertCenterTextId"));

            HasOptional(p => p.LikertRightText)
                .WithMany()
                .Map(m => m.MapKey("LikertRightTextId"));

            ToTable("Questions");
        }
    }
}
