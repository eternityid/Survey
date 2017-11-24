using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Nodes
{
    internal class GoToFolderMap : EntityTypeConfiguration<GoToFolder>
    {
        public GoToFolderMap()
        {
            HasOptional(p => p.GoToFolderNode)
                .WithMany()
                .Map(m => m.MapKey("GoToFolderNodeId"));

            ToTable("Nodes");
        }
    }
}