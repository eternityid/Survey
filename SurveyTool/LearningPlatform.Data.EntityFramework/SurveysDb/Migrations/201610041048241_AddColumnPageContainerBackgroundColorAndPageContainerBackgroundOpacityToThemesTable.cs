using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class AddColumnPageContainerBackgroundColorAndPageContainerBackgroundOpacityToThemesTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Themes", "PageContainerBackgroundColor", c => c.String(defaultValue: "#ffffff"));
            AddColumn("dbo.Themes", "PageContainerBackgroundOpacity", c => c.Single(nullable: false, defaultValue: 0.25f));
        }

        public override void Down()
        {
            DropColumn("dbo.Themes", "PageContainerBackgroundOpacity");
            DropColumn("dbo.Themes", "PageContainerBackgroundColor");
        }
    }
}
