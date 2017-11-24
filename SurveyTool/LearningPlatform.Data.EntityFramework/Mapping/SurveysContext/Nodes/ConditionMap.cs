using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Nodes
{
    internal class ConditionMap : EntityTypeConfiguration<Condition>
    {
        public ConditionMap()
        {
            Property(p => p.ScriptCodeExpression)
                .HasColumnName("ScriptCode");

            HasOptional(t => t.TrueFolder)
                .WithMany()
                .Map(m => m.MapKey("TrueFolderId"));

            HasOptional(t => t.FalseFolder)
                .WithMany()
                .Map(m => m.MapKey("FalseFolderId"));

            HasOptional(t => t.Expression)
                .WithMany()
                .Map(m => m.MapKey("ExpressionId"));

            ToTable("Nodes");
        }
    }
}