namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class PagesLookAndFeel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Nodes", "PageLayoutId", c => c.Long());
            AddColumn("dbo.Nodes", "PageThemeId", c => c.Long());
            AddColumn("dbo.Nodes", "PageThemeOverrideId", c => c.Long());
            AddColumn("dbo.Themes", "IsPageOverride", c => c.Boolean());
            AlterColumn("dbo.Themes", "InactiveOpacity", c => c.Single());
            AlterColumn("dbo.Themes", "IsRepeatBackground", c => c.Boolean());
            CreateIndex("dbo.Nodes", "PageThemeOverrideId");
            AddForeignKey("dbo.Nodes", "PageThemeOverrideId", "dbo.Themes", "Id");
        }

        public override void Down()
        {
            DropForeignKey("dbo.Nodes", "PageThemeOverrideId", "dbo.Themes");
            DropIndex("dbo.Nodes", new[] { "PageThemeOverrideId" });
            AlterColumn("dbo.Themes", "IsRepeatBackground", c => c.Boolean(nullable: false));
            AlterColumn("dbo.Themes", "InactiveOpacity", c => c.Single(nullable: false));
            DropColumn("dbo.Themes", "IsPageOverride");
            DropColumn("dbo.Nodes", "PageThemeOverrideId");
            DropColumn("dbo.Nodes", "PageThemeId");
            DropColumn("dbo.Nodes", "PageLayoutId");
        }
    }
}
