using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Nodes
{
    internal class NodeMap : EntityTypeConfiguration<Node>
    {
        public NodeMap()
        {
            Property(t => t.Alias)
                .IsRequired()
                .IsVariableLength()
                .HasMaxLength(256);

            Property(t => t.NodeType)
                .IsOptional()
                .IsVariableLength()
                .HasMaxLength(30);

            Property(t => t.SurveyId)
                .HasColumnAnnotation("Index", new IndexAnnotation(new IndexAttribute()));

            HasOptional(t => t.Parent)
                .WithMany(d => d.ChildNodes)
                .HasForeignKey(d => d.ParentId);

            Property(t => t.RowVersion).IsRowVersion();

            Ignore(t => t.QuestionAliases);

            ToTable("Nodes");
        }
    }
}
