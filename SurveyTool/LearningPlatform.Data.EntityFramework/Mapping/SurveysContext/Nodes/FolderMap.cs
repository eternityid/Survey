using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Nodes
{
    internal class FolderMap : EntityTypeConfiguration<Folder>
    {
        public FolderMap()
        {
            Property(p => p.Seed)
                .HasColumnName("Seed"); // Need this to make sure the column reuses the Seed column from PageDefinition.

            Property(p => p.OrderType)
                .HasColumnName("OrderType"); // Need this to make sure the column reuses the Seed column from PageDefinition.

            HasOptional(p => p.Loop)
                .WithMany()
                .Map(m => m.MapKey("LoopId"));

            ToTable("Nodes");
        }
    }
}