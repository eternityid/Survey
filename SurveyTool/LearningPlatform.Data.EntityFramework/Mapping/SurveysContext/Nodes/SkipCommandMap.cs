using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Nodes
{
    internal class SkipCommandMap : EntityTypeConfiguration<SkipCommand>
    {
        public SkipCommandMap()
        {
            Property(t => t.SurveyId)
                .HasColumnAnnotation("Index", new IndexAnnotation(new IndexAttribute()));

            HasOptional(p => p.Expression)
                .WithMany()
                .Map(m => m.MapKey("ExpressionId"));

            ToTable("SkipCommands");
        }
    }
}