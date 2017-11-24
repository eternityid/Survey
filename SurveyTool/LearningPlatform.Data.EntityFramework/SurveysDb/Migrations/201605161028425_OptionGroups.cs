using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class OptionGroups : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.OptionGroups",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Alias = c.String(),
                        OrderType = c.Int(),
                        ListId = c.Long(nullable: false),
                        HideHeading = c.Boolean(nullable: false),
                        HeadingId = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.LanguageStrings", t => t.HeadingId)
                .ForeignKey("dbo.OptionLists", t => t.ListId, cascadeDelete: true)
                .Index(t => t.ListId)
                .Index(t => t.HeadingId);
            
            AddColumn("dbo.Options", "GroupAlias", c => c.String());
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.OptionGroups", "ListId", "dbo.OptionLists");
            DropForeignKey("dbo.OptionGroups", "HeadingId", "dbo.LanguageStrings");
            DropIndex("dbo.OptionGroups", new[] { "HeadingId" });
            DropIndex("dbo.OptionGroups", new[] { "ListId" });
            DropColumn("dbo.Options", "GroupAlias");
            DropTable("dbo.OptionGroups");
        }
    }
}
