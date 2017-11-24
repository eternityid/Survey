using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.Pages;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Nodes
{
    internal class PageDefinitionMap : EntityTypeConfiguration<PageDefinition>
    {
        public PageDefinitionMap()
        {
            HasOptional(p => p.Title)
                .WithMany()
                .Map(m => m.MapKey("TitleId"));

            HasOptional(p => p.Description)
                .WithMany()
                .Map(m => m.MapKey("DecriptionId"));

            Property(p => p.Seed)
                .HasColumnName("Seed"); // Need this to make sure the column reuses the Seed column from Folder.

            Property(p => p.OrderType)
                .HasColumnName("OrderType"); // Need this to make sure the column reuses the Seed column from Folder.

            Property(p => p.ResponseStatus)
                .IsOptional()
                .IsVariableLength()
                .HasMaxLength(30);

            HasOptional(p => p.PageThemeOverrides)
                .WithMany()
                .Map(m => m.MapKey("PageThemeOverrideId"));

            HasMany(k => k.ChildNodes);

            HasMany(s => s.SkipCommands)
                .WithRequired()
                .WillCascadeOnDelete(true);

            ToTable("Nodes");
        }
    }
}
