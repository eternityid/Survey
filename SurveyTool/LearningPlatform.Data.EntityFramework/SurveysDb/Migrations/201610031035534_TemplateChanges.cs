using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class TemplateChanges : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.TemplateItems", "TemplateId", "dbo.Templates");
            DropIndex("dbo.TemplateItems", new[] { "TemplateId" });
            AddColumn("dbo.Templates", "Content", c => c.String());
            AlterColumn("dbo.Templates", "Name", c => c.String(maxLength: 30));
            DropTable("dbo.TemplateItems");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.TemplateItems",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        ItemType = c.Int(nullable: false),
                        Html = c.String(),
                        TemplateId = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            AlterColumn("dbo.Templates", "Name", c => c.String(nullable: false, maxLength: 30));
            DropColumn("dbo.Templates", "Content");
            CreateIndex("dbo.TemplateItems", "TemplateId");
            AddForeignKey("dbo.TemplateItems", "TemplateId", "dbo.Templates", "Id", cascadeDelete: true);
        }
    }
}
