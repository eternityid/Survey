using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.Resources;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext
{
    internal class ResourceStringItemMap : EntityTypeConfiguration<ResourceStringItem>
    {
        public ResourceStringItemMap()
        {
            Property(t => t.Text)
                .IsRequired();

            // Table & Column Mappings
            ToTable("ResourceItems");
        }
    }
}