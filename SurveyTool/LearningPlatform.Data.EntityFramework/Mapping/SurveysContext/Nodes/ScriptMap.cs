using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Nodes
{
    internal class ScriptMap : EntityTypeConfiguration<Script>
    {
        public ScriptMap()
        {
            Property(p => p.ScriptCode)
                .HasColumnName("ScriptCode");

            ToTable("Nodes");
        }
    }
}
